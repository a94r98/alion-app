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
  
  const url = new URL(req.url)
  const status = url.searchParams.get('status') || 'all'
  
  const charges = await prisma.charge.findMany({
    where: status !== 'all' ? { status } : undefined,
    include: { user: { select: { name: true, email: true, id: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ charges })
}

export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { chargeId, action, note } = await req.json()
  if (!chargeId || !action) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 })

  const charge = await prisma.charge.findUnique({ where: { id: chargeId }, include: { user: true } })
  if (!charge) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })

  if (action === 'approve') {
    await prisma.$transaction([
      prisma.charge.update({
        where: { id: chargeId },
        data: { status: 'approved', adminNote: note, reviewedAt: new Date(), reviewedBy: admin.id }
      }),
      prisma.user.update({
        where: { id: charge.userId },
        data: { balance: { increment: charge.amount } }
      }),
      prisma.walletTransaction.create({
        data: { userId: charge.userId, type: 'credit', amount: charge.amount, balanceBefore: charge.user.balance, balanceAfter: charge.user.balance + charge.amount, description: `شحن محفظة - ${charge.method}`, refType: 'charge', refId: chargeId }
      }),
    ])
  } else if (action === 'reject') {
    await prisma.charge.update({
      where: { id: chargeId },
      data: { status: 'rejected', adminNote: note, reviewedAt: new Date(), reviewedBy: admin.id }
    })
  }

  return NextResponse.json({ success: true })
}
