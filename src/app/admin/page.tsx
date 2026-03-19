'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Users, ShoppingBag, Wallet, AlertTriangle,
  TrendingUp, Clock, CheckCircle, XCircle,
  Package, DollarSign, Activity, Settings,
  ChevronLeft, Eye, Check, X
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'charges' | 'orders'>('overview')
  const [charges, setCharges] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/login'); return }
    if (status === 'authenticated') {
      fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) })
    }
  }, [status, router])

  const loadCharges = () => {
    fetch('/api/admin/charges').then(r => r.json()).then(d => setCharges(d.charges || []))
  }
  const loadOrders = () => {
    fetch('/api/admin/orders').then(r => r.json()).then(d => setOrders(d.orders || []))
  }

  const handleCharge = async (chargeId: string, action: 'approve' | 'reject') => {
    setProcessingId(chargeId)
    await fetch('/api/admin/charges', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chargeId, action })
    })
    loadCharges()
    fetch('/api/admin/stats').then(r => r.json()).then(d => setStats(d))
    setProcessingId(null)
  }

  const handleOrder = async (orderId: string, action: 'complete' | 'fail') => {
    setProcessingId(orderId)
    await fetch('/api/admin/orders', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: action === 'complete' ? 'completed' : 'failed' })
    })
    loadOrders()
    setProcessingId(null)
  }

  useEffect(() => {
    if (activeTab === 'charges') loadCharges()
    if (activeTab === 'orders') loadOrders()
  }, [activeTab])

  if (loading || !stats) return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050A14' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #00D4FF', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const st = stats.stats || {}
  const statCards = [
    { label: 'المستخدمون', value: st.totalUsers || 0, icon: Users, color: '#00D4FF', sub: 'إجمالي المسجلين' },
    { label: 'الطلبات', value: st.totalOrders || 0, icon: ShoppingBag, color: '#00E676', sub: 'إجمالي الطلبات' },
    { label: 'بانتظار المراجعة', value: st.pendingOrders || 0, icon: Clock, color: '#FFB300', sub: 'طلبات معلقة' },
    { label: 'دفعات معلقة', value: st.pendingCharges || 0, icon: Wallet, color: '#FF5252', sub: 'بانتظار القبول' },
    { label: 'الإيرادات', value: `$${(st.totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: '#FFD700', sub: 'إجمالي المبيعات' },
    { label: 'النشاط', value: '🟢', icon: Activity, color: '#00E676', sub: 'الموقع يعمل بشكل جيد' },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: '#050A14', color: '#E8F4FF', fontFamily: 'Cairo, sans-serif' }}>
      {/* Top Bar */}
      <div style={{ background: 'rgba(5,10,20,0.98)', borderBottom: '1px solid rgba(0,212,255,0.1)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676' }} />
          <span style={{ fontWeight: 900, fontSize: 17, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🦁 ALION Admin
          </span>
        </div>
        <Link href="/" style={{ color: '#8BAABE', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ChevronLeft size={16} /> الموقع
        </Link>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(10,16,32,0.8)', position: 'sticky', top: 50, zIndex: 40 }}>
        {[
          { key: 'overview', label: '📊 الإحصائيات', icon: TrendingUp },
          { key: 'charges', label: `💳 الدفعات${st.pendingCharges > 0 ? ` (${st.pendingCharges})` : ''}`, icon: Wallet },
          { key: 'orders', label: `📦 الطلبات${st.pendingOrders > 0 ? ` (${st.pendingOrders})` : ''}`, icon: Package },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)} style={{
            flex: 1, padding: '11px 4px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
            background: activeTab === t.key ? 'rgba(0,212,255,0.1)' : 'transparent',
            color: activeTab === t.key ? '#00D4FF' : '#8BAABE',
            borderBottom: activeTab === t.key ? '2px solid #00D4FF' : '2px solid transparent',
            fontFamily: 'Cairo, sans-serif',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '14px' }}>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
              {statCards.map((c, i) => {
                const Icon = c.icon
                return (
                  <div key={i} style={{ background: 'rgba(15,25,41,0.8)', border: `1px solid ${c.color}25`, borderRadius: 16, padding: '14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Icon size={18} style={{ color: c.color }} />
                      <span style={{ background: `${c.color}18`, color: c.color, fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6 }}>
                        {c.sub}
                      </span>
                    </div>
                    <div style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 900, color: c.color }}>{c.value}</div>
                    <div style={{ fontSize: 12, color: '#8BAABE', marginTop: 3 }}>{c.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Quick links */}
            <div style={{ background: 'rgba(15,25,41,0.8)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 16, padding: '14px' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#00D4FF', marginBottom: 12 }}>⚡ روابط سريعة</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {[
                  { href: '/admin/products', label: 'المنتجات', icon: '📦' },
                  { href: '/admin/users', label: 'المستخدمون', icon: '👥' },
                  { href: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
                ].map(link => (
                  <Link key={link.href} href={link.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', borderRadius: 12, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', textDecoration: 'none' }}>
                    <span style={{ fontSize: 22 }}>{link.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#8BAABE' }}>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CHARGES */}
        {activeTab === 'charges' && (
          <div>
            <p style={{ fontSize: 13, color: '#8BAABE', marginBottom: 12 }}>
              {charges.filter(c => c.status === 'pending').length} دفعة بانتظار الموافقة
            </p>
            {charges.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Wallet size={48} style={{ color: '#4A6278', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: '#4A6278' }}>لا توجد دفعات</p>
              </div>
            ) : (
              charges.map(charge => (
                <div key={charge.id} style={{ background: 'rgba(15,25,41,0.8)', border: `1px solid ${charge.status === 'pending' ? 'rgba(255,179,0,0.3)' : 'rgba(0,212,255,0.1)'}`, borderRadius: 16, padding: '14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>${charge.amount.toFixed(2)} - {charge.method}</p>
                      <p style={{ fontSize: 12, color: '#8BAABE' }}>{charge.user?.name} · {charge.user?.email}</p>
                      <p style={{ fontSize: 11, color: '#4A6278', marginTop: 2 }}>{new Date(charge.createdAt).toLocaleString('ar')}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: charge.status === 'pending' ? 'rgba(255,179,0,0.15)' : charge.status === 'approved' ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)', color: charge.status === 'pending' ? '#FFB300' : charge.status === 'approved' ? '#00E676' : '#FF5252' }}>
                      {charge.status === 'pending' ? '⏳ معلق' : charge.status === 'approved' ? '✅ مقبول' : '❌ مرفوض'}
                    </span>
                  </div>

                  {charge.senderNote && <p style={{ fontSize: 12, color: '#8BAABE', marginBottom: 10, background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: 8 }}>📝 {charge.senderNote}</p>}

                  {charge.proofImage && (
                    <a href={charge.proofImage} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00D4FF', textDecoration: 'none', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                      <Eye size={14} /> عرض الإيصال
                    </a>
                  )}

                  {charge.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleCharge(charge.id, 'approve')} disabled={processingId === charge.id} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#00E676,#00B248)', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Check size={15} /> قبول الدفعة
                      </button>
                      <button onClick={() => handleCharge(charge.id, 'reject')} disabled={processingId === charge.id} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,82,82,0.3)', cursor: 'pointer', background: 'rgba(255,82,82,0.15)', color: '#FF5252', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <X size={15} /> رفض
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Package size={48} style={{ color: '#4A6278', display: 'block', margin: '0 auto 12px' }} />
                <p style={{ color: '#4A6278' }}>لا توجد طلبات</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ background: 'rgba(15,25,41,0.8)', border: `1px solid ${order.status === 'pending' ? 'rgba(255,179,0,0.3)' : 'rgba(0,212,255,0.1)'}`, borderRadius: 16, padding: '14px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{order.product?.nameAr}</p>
                      <p style={{ fontSize: 12, color: '#8BAABE', marginTop: 2 }}>{order.user?.name} · ID: {order.inputValue}</p>
                      <p style={{ fontSize: 11, color: '#4A6278', marginTop: 2 }}>${order.amount} · {new Date(order.createdAt).toLocaleString('ar')}</p>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: order.status === 'pending' ? 'rgba(255,179,0,0.15)' : order.status === 'completed' ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)', color: order.status === 'pending' ? '#FFB300' : order.status === 'completed' ? '#00E676' : '#FF5252', height: 'fit-content' }}>
                      {order.status === 'pending' ? '⏳ معلق' : order.status === 'completed' ? '✅ منجز' : '❌ فشل'}
                    </span>
                  </div>
                  {order.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleOrder(order.id, 'complete')} disabled={processingId === order.id} style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#00E676,#00B248)', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                        ✅ تم التنفيذ
                      </button>
                      <button onClick={() => handleOrder(order.id, 'fail')} disabled={processingId === order.id} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(255,82,82,0.3)', cursor: 'pointer', background: 'rgba(255,82,82,0.1)', color: '#FF5252', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                        ❌ فشل التنفيذ
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
