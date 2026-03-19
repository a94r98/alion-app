'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ShoppingCart } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'
import ProductModal from '@/components/shared/ProductModal'
import { getAppStyle } from '@/components/shared/ProductModal'

// Group configs — each group has display name, emoji, color, and a name filter
const GROUP_CONFIG: Record<string, { nameAr: string; emoji: string; color: string; bg: string; filter: string }> = {
  'pubg':         { nameAr: 'ببجي موبايل', emoji: '🎯', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', filter: 'ببجي' },
  'free-fire':    { nameAr: 'فري فاير', emoji: '🔥', color: '#FF6B35', bg: 'rgba(255,107,53,0.08)', filter: 'فري فاير' },
  'yalla-ludo':   { nameAr: 'يلا لودو', emoji: '🎲', color: '#9B59B6', bg: 'rgba(155,89,182,0.08)', filter: 'يلا لودو' },
  'itunes':       { nameAr: 'iTunes Gift Card', emoji: '🍎', color: '#FF3B30', bg: 'rgba(255,59,48,0.08)', filter: 'iTunes' },
  'google-play':  { nameAr: 'Google Play', emoji: '▶️', color: '#00E676', bg: 'rgba(0,230,118,0.08)', filter: 'Google Play' },
  'shahid':       { nameAr: 'SHAHID VIP', emoji: '📺', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', filter: 'SHAHID' },
  'payeer':       { nameAr: 'PAYEER', emoji: '💳', color: '#FF9800', bg: 'rgba(255,152,0,0.08)', filter: 'PAYEER' },
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  'شائع':   { bg: 'rgba(0,212,255,0.15)', text: '#00D4FF' },
  'الأوفر': { bg: 'rgba(0,230,118,0.15)', text: '#00E676' },
  'VIP':    { bg: 'rgba(255,215,0,0.15)',  text: '#FFD700' },
}

export default function ShopGroupPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = use(params)
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const config = GROUP_CONFIG[group]

  useEffect(() => {
    if (!config) return
    fetch(`/api/products?search=${encodeURIComponent(config.filter)}`)
      .then(r => r.json())
      .then(d => {
        // Sort by price ascending
        const sorted = (d.products || []).sort((a: any, b: any) => a.price - b.price)
        setProducts(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [group, config])

  if (!config) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <span style={{ fontSize: 48 }}>😕</span>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>الصفحة غير موجودة</p>
        <button onClick={() => router.back()} style={{ padding: '10px 20px', borderRadius: 12, background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>رجوع</button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 88 }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,20,0.97)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
          <button onClick={() => router.back()} style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ChevronLeft size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: config.bg, border: `1px solid ${config.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
            {config.emoji}
          </div>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: 16, margin: 0, color: 'var(--text-primary)' }}>{config.nameAr}</h1>
            {!loading && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{products.length} باقة متاحة</p>}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 14px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>لا توجد باقات متاحة</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {products.map(product => {
              const badge = product.badge
              const badgeStyle = badge ? (BADGE_COLORS[badge] || { bg: 'rgba(0,212,255,0.15)', text: '#00D4FF' }) : null

              return (
                <button key={product.id} onClick={() => setSelectedProduct(product)}
                  style={{
                    background: 'var(--bg-card)', border: `1px solid var(--border)`, borderRadius: 16,
                    padding: '16px 12px', cursor: 'pointer', textAlign: 'center',
                    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    transition: 'all 0.18s', fontFamily: 'Cairo, sans-serif',
                    boxSizing: 'border-box', width: '100%',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${config.color}55`; (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>

                  {/* Badge */}
                  {badge && badgeStyle && (
                    <div style={{ position: 'absolute', top: 8, right: 8, background: badgeStyle.bg, color: badgeStyle.text, fontSize: 9, fontWeight: 800, borderRadius: 8, padding: '2px 7px', border: `1px solid ${badgeStyle.text}44` }}>
                      {badge}
                    </div>
                  )}

                  {/* Emoji icon */}
                  <div style={{ width: 54, height: 54, borderRadius: 14, background: config.bg, border: `1px solid ${config.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                    {config.emoji}
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4, direction: 'rtl' }}>
                    {product.nameAr}
                  </div>

                  {/* Price */}
                  <div style={{ fontSize: 16, fontWeight: 900, color: config.color, direction: 'ltr' }}>
                    ${product.price.toFixed(2)}
                  </div>

                  {/* Buy button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: config.color, color: config.color === '#FFD700' ? '#0A0F1E' : 'white', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 800, marginTop: 2, width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}>
                    <ShoppingCart size={12} />
                    شراء
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <BottomNav />
    </div>
  )
}
