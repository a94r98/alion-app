import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, phone } = await req.json()

  if (!firstName || !email || !password)
    return NextResponse.json({ error: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 12)
  const username = `user_${Date.now()}`

  const user = await prisma.user.create({
    data: {
      firstName, lastName,
      name: `${firstName} ${lastName || ''}`.trim(),
      email, password: hashed, phone, username,
    }
  })

  return NextResponse.json({ success: true, userId: user.id })
}
