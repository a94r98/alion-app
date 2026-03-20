export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ notifications: [] })

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ notifications: [] })

  // Get recent orders as notifications
  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { product: { select: { nameAr: true } } }
  })

  const recentCharges = await prisma.charge.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const notifications = [
    ...recentOrders.map(o => ({
      id: `order-${o.id}`,
      type: 'order',
      title: o.status === 'completed' ? '✅ تم تنفيذ طلبك!' : o.status === 'failed' ? '❌ فشل الطلب' : '⏳ طلب قيد المراجعة',
      body: o.product?.nameAr || 'منتج',
      time: o.createdAt,
      read: o.status !== 'pending',
      icon: o.status === 'completed' ? 'success' : o.status === 'failed' ? 'danger' : 'warning',
    })),
    ...recentCharges.map(c => ({
      id: `charge-${c.id}`,
      type: 'charge',
      title: c.status === 'approved' ? '💰 تم قبول الشحن!' : c.status === 'rejected' ? '❌ رُفض طلب الشحن' : '⏳ طلب شحن معلق',
      body: `$${c.amount} - ${c.method}`,
      time: c.createdAt,
      read: c.status !== 'pending',
      icon: c.status === 'approved' ? 'success' : c.status === 'rejected' ? 'danger' : 'warning',
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 15)

  const unread = notifications.filter(n => !n.read).length

  return NextResponse.json({ notifications, unread })
}
