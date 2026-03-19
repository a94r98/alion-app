'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, ShoppingBag, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'قيد المراجعة', color: '#FFB300', icon: Clock },
  processing: { label: 'جاري التنفيذ', color: '#00D4FF', icon: RefreshCw },
  completed:  { label: 'منجز ✅',       color: '#00E676', icon: CheckCircle },
  failed:     { label: 'فشل ❌',        color: '#FF5252', icon: XCircle },
  refunded:   { label: 'مسترجع',        color: '#9C27B0', icon: RefreshCw },
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return }
    if (status === 'authenticated') {
      fetch('/api/orders').then(r => r.json()).then(d => { setOrders(d.orders || []); setLoading(false) })
    }
  }, [status, router])

  const filtered = orders.filter(o => filter === 'all' || o.status === filter)

  if (loading) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>طلباتي</span>
        <span style={{ marginRight: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{orders.length} طلب</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '14px' }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, marginBottom: 14 }} className="no-scrollbar">
          {[
            { key: 'all', label: 'الكل' },
            { key: 'pending', label: '⏳ قيد المراجعة' },
            { key: 'completed', label: '✅ منجز' },
            { key: 'failed', label: '❌ فشل' },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              cursor: 'pointer', border: 'none', flexShrink: 0, fontFamily: 'Cairo, sans-serif',
              background: filter === t.key ? 'var(--primary)' : 'var(--bg-card)',
              color: filter === t.key ? 'white' : 'var(--text-secondary)',
              outline: `1px solid ${filter === t.key ? 'transparent' : 'var(--border)'}`,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0' }}>
            <ShoppingBag size={52} style={{ color: 'var(--text-muted)', margin: '0 auto 14px', display: 'block' }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>لا توجد طلبات {filter !== 'all' ? 'في هذا القسم' : ''}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>ابدأ بشحن لعبتك المفضلة الآن</p>
            <button onClick={() => router.push('/')} style={{ padding: '10px 28px', borderRadius: 12, background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: 'white', border: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              تسوّق الآن
            </button>
          </div>
        ) : (
          filtered.map(order => {
            const st = STATUS_MAP[order.status] || STATUS_MAP.pending
            const Icon = st.icon
            return (
              <div key={order.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Icon */}
                <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${st.color}18`, border: `1px solid ${st.color}30`, fontSize: 18 }}>
                  {order.product?.category?.name === 'games' ? '🎮' : '💬'}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {order.product?.nameAr || 'منتج'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>
                    ID: {order.inputValue} · {new Date(order.createdAt).toLocaleDateString('ar', { day: '2-digit', month: 'short' })}
                  </p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 8, background: `${st.color}18`, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                {/* Amount */}
                <div style={{ textAlign: 'left', flexShrink: 0 }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>${order.amount?.toFixed(2)}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>x{order.quantity}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
      <BottomNav />
    </div>
  )
}
