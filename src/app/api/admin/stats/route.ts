export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Admin middleware check
async function checkAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return null
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user || user.role !== 'admin') return null
  return user
}

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const [totalUsers, totalOrders, pendingOrders, pendingCharges, totalRevenue] = await Promise.all([
    prisma.user.count({ where: { role: 'user' } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.charge.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 10, orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } }, product: { select: { nameAr: true } } }
  })

  const recentCharges = await prisma.charge.findMany({
    take: 10, orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } }
  })

  return NextResponse.json({
    stats: {
      totalUsers, totalOrders, pendingOrders, pendingCharges,
      totalRevenue: totalRevenue._sum.amount || 0,
    },
    recentOrders, recentCharges,
  })
}
