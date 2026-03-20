export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function checkAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return null
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user || user.role !== 'admin') return null
  return user
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const orders = await prisma.order.findMany({
    take: 50, orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { nameAr: true, category: { select: { nameAr: true } } } }
    }
  })
  return NextResponse.json({ orders })
}

export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { orderId, status, adminNote } = await req.json()
  if (!orderId || !status) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })

  await prisma.order.update({
    where: { id: orderId },
    data: { status, adminNote, processedAt: new Date(), processedBy: admin.id }
  })
  return NextResponse.json({ success: true })
}
