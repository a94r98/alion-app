'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Bell, Star, TrendingUp, Zap, Shield } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'
import ProductModal from '@/components/shared/ProductModal'
import ChatWidget from '@/components/chat/ChatWidget'
import ParticlesBackground from '@/components/shared/ParticlesBackground'
import { getAppStyle } from '@/components/shared/ProductModal'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Constants ───
const stats = [
  { label: 'مستخدم', value: '+12K', icon: '👥' },
  { label: 'طلب منجز', value: '+98K', icon: '✅' },
  { label: 'تطبيق', value: '+36', icon: '📱' },
]

const features = [
  { icon: <Zap size={13} />, label: 'شحن فوري', color: 'var(--gold)' },
  { icon: <Shield size={13} />, label: 'حماية كاملة', color: 'var(--success)' },
  { icon: <Star size={13} />, label: 'VIP مميز', color: 'var(--primary)' },
  { icon: <TrendingUp size={13} />, label: 'أسعار تنافسية', color: '#FF9800' },
]

const filters = [
  { key: 'all', label: 'الكل' },
  { key: 'game', label: '🎮 ألعاب' },
  { key: 'chat', label: '💬 دردشة' },
  { key: 'giftcard', label: '🎁 بطاقات' },
  { key: 'subscription', label: '👑 VIP' },
  { key: 'wallet', label: '💳 محافظ' },
  { key: 'telecom', label: '📞 رصيد' },
]

// Multi-package groups (one icon on homepage → navigates to /shop/[group])
const PRODUCT_GROUPS: Record<string, { nameAr: string; emoji: string; color: string; bg: string }> = {
  'pubg':        { nameAr: 'ببجي موبايل', emoji: '🎯', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'free-fire':   { nameAr: 'فري فاير',   emoji: '🔥', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'yalla-ludo':  { nameAr: 'يلا لودو',   emoji: '🎲', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  'itunes':      { nameAr: 'iTunes',      emoji: '🍎', color: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  'google-play': { nameAr: 'Google Play', emoji: '▶️', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  'shahid':      { nameAr: 'SHAHID VIP', emoji: '📺', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'payeer':      { nameAr: 'PAYEER',      emoji: '💳', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
}

function getGroupSlug(product: any): string | null {
  const name = (product.nameAr || product.name || '').toLowerCase()
  if (name.includes('ببجي') || name.includes('pubg')) return 'pubg'
  if (name.includes('فري فاير') || name.includes('فر فاير') || name.includes('free fire')) return 'free-fire'
  if (name.includes('يلا لودو') || name.includes('yalla ludo')) return 'yalla-ludo'
  if (name.includes('itunes')) return 'itunes'
  if (name.includes('google play')) return 'google-play'
  if (name.includes('shahid')) return 'shahid'
  if (name.includes('payeer')) return 'payeer'
  return null
}

// ─── Page ───
export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      setProducts(d.products || [])
      setLoadingProducts(false)
    }).catch(() => setLoadingProducts(false))
  }, [])

  useEffect(() => {
    if (session) {
      fetch('/api/notifications').then(r => r.json()).then(d => setUnreadCount(d.unread || 0))
    }
  }, [session])

  // Filter by search + category type
  const filtered = products.filter(p => {
    const matchSearch = (p.nameAr || p.name || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.type === filter
    return matchSearch && matchFilter
  })

  // Build display: chat apps → multiple cards (modal), others → one group card (navigate to /shop/[group])
  type DisplayItem = { kind: 'chat'; product: any } | { kind: 'group'; slug: string; cfg: typeof PRODUCT_GROUPS[string] }
  const seenGroups = new Set<string>()
  const displayItems: DisplayItem[] = []
  for (const p of filtered) {
    if (p.type === 'chat') {
      displayItems.push({ kind: 'chat', product: p })
    } else {
      const slug = getGroupSlug(p)
      if (slug && !seenGroups.has(slug) && PRODUCT_GROUPS[slug]) {
        seenGroups.add(slug)
        displayItems.push({ kind: 'group', slug, cfg: PRODUCT_GROUPS[slug] })
      }
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', position: 'relative' }}>
      <ParticlesBackground />

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(5,10,20,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
          <button onClick={() => router.push('/notifications')}
            style={{ position: 'relative', padding: 8, borderRadius: '50%', background: 'var(--bg-card)', border: `1px solid ${unreadCount > 0 ? 'rgba(255,82,82,0.4)' : 'var(--border)'}`, cursor: 'pointer', flexShrink: 0 }}>
            <Bell size={18} style={{ color: unreadCount > 0 ? '#FF5252' : 'var(--text-secondary)', display: 'block' }} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#FF5252', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'white' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#00D4FF,#FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🦁</div>
            <span style={{ fontSize: 17, fontWeight: 900, background: 'linear-gradient(135deg,#fff,#00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ALION</span>
          </div>

          <Link href="/wallet" style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, padding: '5px 10px', textDecoration: 'none' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>${(session as any)?.user?.balance?.toFixed(2) ?? '0.00'}</span>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px 14px 100px' }}>
        {/* Hero Banner */}
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg,rgba(0,212,255,0.1),rgba(255,215,0,0.05))', border: '1px solid rgba(0,212,255,0.15)', padding: '16px 18px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, marginBottom: 4, opacity: 0.7 }}>🦁 مجموعة ALION التجارية</div>
          <h1 style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 900, margin: '0 0 6px', lineHeight: 1.2, color: '#fff' }}>
            منصة الشحن<br />
            <span style={{ background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الأسرع والأذكى</span>
          </h1>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>شحن فوري · آمن · موثوق</p>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 52, opacity: 0.15 }}>🦁</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: 14, padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 18 }}>{s.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {features.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '5px 10px' }}>
              <span style={{ color: f.color }}>{f.icon}</span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <input type="text" placeholder="ابحث عن خدمة..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '11px 38px 11px 14px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'Cairo, sans-serif', outline: 'none' }} />
          <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginTop: 2, overflowX: 'auto', paddingBottom: 2 }} className="no-scrollbar">
          {filters.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', flexShrink: 0, background: filter === tab.key ? 'var(--primary)' : 'var(--bg-card)', color: filter === tab.key ? 'white' : 'var(--text-secondary)', outline: `1px solid ${filter === tab.key ? 'var(--primary)' : 'var(--border)'}`, transition: 'all 0.2s', fontFamily: 'Cairo, sans-serif' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
          {loadingProducts ? (
            [...Array(9)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
            ))
          ) : (
            displayItems.map((item, idx) => {
              if (item.kind === 'chat') {
                const p = item.product
                const s = getAppStyle(p.nameAr || p.name, p.type)
                return (
                  <button key={p.id} onClick={() => setSelectedProduct(p)} className="product-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 6px', textAlign: 'center', border: 'none', cursor: 'pointer', width: '100%' }}>
                    <div style={{ width: 'clamp(44px,12vw,58px)', height: 'clamp(44px,12vw,58px)', borderRadius: 14, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg, border: `1px solid ${s.color}40`, fontSize: 'clamp(20px,6vw,26px)' }}>
                      {s.emoji}
                    </div>
                    <div style={{ fontSize: 'clamp(9px,2.5vw,11px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, width: '100%', wordBreak: 'break-word' }}>
                      {(p.nameAr || p.name || '').split(' ').slice(0, 3).join(' ')}
                    </div>
                  </button>
                )
              } else {
                // GROUP CARD → navigate to /shop/[group]
                const { slug, cfg } = item
                return (
                  <button key={`group-${slug}`} onClick={() => router.push(`/shop/${slug}`)} className="product-card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 6px', textAlign: 'center', border: 'none', cursor: 'pointer', width: '100%', position: 'relative' }}>
                    <div style={{ width: 'clamp(44px,12vw,58px)', height: 'clamp(44px,12vw,58px)', borderRadius: 14, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: cfg.bg, border: `1px solid ${cfg.color}40`, fontSize: 'clamp(20px,6vw,26px)' }}>
                      {cfg.emoji}
                    </div>
                    <div style={{ fontSize: 'clamp(9px,2.5vw,11px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, width: '100%', wordBreak: 'break-word' }}>
                      {cfg.nameAr}
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', marginTop: 2 }}>باقات ▸</div>
                  </button>
                )
              }
            })
          )}
        </div>

        {!loadingProducts && displayItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 14 }}>لا توجد نتائج لـ &quot;{search}&quot;</p>
          </div>
        )}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <ChatWidget />
      <BottomNav />
    </div>
  )
}
