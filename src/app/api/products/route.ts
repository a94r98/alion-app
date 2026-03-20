export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const type = url.searchParams.get('type') || 'all'
  const search = url.searchParams.get('search') || ''
  const categorySlug = url.searchParams.get('category') || ''

  const where: any = { isActive: true, isAvailable: true }
  if (categorySlug) {
    const cat = await prisma.category.findFirst({ where: { slug: categorySlug } })
    if (cat) where.categoryId = cat.id
  } else if (type !== 'all') {
    where.type = type
  }
  if (search) {
    where.OR = [
      { nameAr: { contains: search } },
      { name: { contains: search } },
    ]
  }

  const products = await prisma.product.findMany({
    where, include: { category: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 100,
  })

  // Parse badge from metadata JSON for each product
  const enriched = products.map(p => {
    let badge = null
    try {
      const meta = JSON.parse(p.metadata || '{}')
      badge = meta.badge || null
    } catch { /* ignore */ }
    return { ...p, badge }
  })

  return NextResponse.json({ products: enriched })
}
