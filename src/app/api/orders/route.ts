export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'غير مسجل الدخول' }, { status: 401 })

  const { productId, inputValue, quantity = 1 } = await req.json()
  if (!productId || !inputValue) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || !product.isActive || !product.isAvailable)
    return NextResponse.json({ error: 'المنتج غير متوفر حالياً' }, { status: 400 })

  const total = product.price * quantity
  if (user.balance < total)
    return NextResponse.json({ error: `رصيدك غير كافٍ. رصيدك الحالي: $${user.balance.toFixed(2)}` }, { status: 400 })

  // Create order and deduct balance in transaction
  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: { userId: user.id, productId, amount: total, quantity, inputValue, status: 'pending' }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: total }, totalSpent: { increment: total }, totalOrders: { increment: 1 } }
    }),
    prisma.walletTransaction.create({
      data: { userId: user.id, type: 'debit', amount: total, balanceBefore: user.balance, balanceAfter: user.balance - total, description: `شراء: ${product.nameAr}`, refType: 'order' }
    }),
  ])

  return NextResponse.json({ success: true, orderId: order.id })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'غير مسجل' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json({ orders })
}
