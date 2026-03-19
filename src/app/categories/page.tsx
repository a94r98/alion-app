'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/shared/BottomNav'
import ProductModal from '@/components/shared/ProductModal'

const TYPE_EMOJI: Record<string, string> = { game: '🎮', chat: '💬', telecom: '📞' }
const TYPE_LABEL: Record<string, string> = { game: 'ألعاب', chat: 'تطبيقات دردشة', telecom: 'رصيد واتصالات' }

export default function CategoriesPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      setProducts(d.products || [])
      setLoading(false)
    })
  }, [])

  const filtered = products.filter(p => {
    const matchSearch = p.nameAr?.toLowerCase().includes(search.toLowerCase()) || p.name?.toLowerCase().includes(search.toLowerCase())
    const matchType = selectedType === 'all' || p.type === selectedType
    return matchSearch && matchType
  })

  const types = ['all', 'game', 'chat', 'telecom']

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      <div style={{ background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>جميع المنتجات</span>
        <span style={{ marginRight: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} منتج</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <input type="text" placeholder="ابحث عن منتج..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-alion" style={{ paddingRight: 44, fontSize: 14 }} />
          <Search size={16} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        </div>

        {/* Type filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, marginBottom: 14 }} className="no-scrollbar">
          {types.map(t => (
            <button key={t} onClick={() => setSelectedType(t)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', flexShrink: 0, fontFamily: 'Cairo, sans-serif',
              background: selectedType === t ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedType === t ? 'white' : 'var(--text-secondary)',
              outline: `1px solid ${selectedType === t ? 'transparent' : 'var(--border)'}`,
            }}>
              {t === 'all' ? '🌟 الكل' : `${TYPE_EMOJI[t]} ${TYPE_LABEL[t]}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {filtered.map(product => (
              <button key={product.id} onClick={() => setSelectedProduct(product)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '10px 6px', textAlign: 'center', position: 'relative',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 14, cursor: 'pointer', width: '100%', transition: 'all 0.2s',
                }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12, marginBottom: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `rgba(0,212,255,0.1)`, border: `1px solid rgba(0,212,255,0.2)`,
                  fontSize: 22,
                }}>
                  {TYPE_EMOJI[product.type] || '📦'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, width: '100%', wordBreak: 'break-word' }}>
                  {product.nameAr}
                </div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', marginTop: 4 }}>
                  ${product.price.toFixed(2)}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: 14 }}>لا توجد نتائج</p>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <BottomNav />
    </div>
  )
}
