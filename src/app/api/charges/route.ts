import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'غير مسجل' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })

  const formData = await req.formData()
  const method = formData.get('method') as string
  const amount = parseFloat(formData.get('amount') as string)
  const senderNote = formData.get('senderNote') as string || ''
  const proof = formData.get('proof') as File | null

  if (!method || !amount || amount < 1)
    return NextResponse.json({ error: 'بيانات غير صحيحة' }, { status: 400 })

  let proofPath = ''
  if (proof && proof.size > 0) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const fname = `charge_${user.id}_${Date.now()}${path.extname(proof.name)}`
    const bytes = await proof.arrayBuffer()
    await writeFile(path.join(uploadDir, fname), Buffer.from(bytes))
    proofPath = `/uploads/${fname}`
  }

  const charge = await prisma.charge.create({
    data: { userId: user.id, amount, method, senderNote, proofImage: proofPath, status: 'pending' }
  })

  return NextResponse.json({ success: true, chargeId: charge.id })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'غير مسجل' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })

  const charges = await prisma.charge.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  return NextResponse.json({ charges, balance: user.balance })
}
