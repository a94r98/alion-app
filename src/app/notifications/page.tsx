'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'

const ICON_COLOR: Record<string, string> = {
  success: '#00E676', danger: '#FF5252', warning: '#FFB300'
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notifications')
      .then(r => r.json())
      .then(d => { setNotifications(d.notifications || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'الآن'
    if (mins < 60) return `منذ ${mins} دقيقة`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `منذ ${hours} ساعة`
    return `منذ ${Math.floor(hours / 24)} يوم`
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>🔔 الإشعارات</span>
        {notifications.filter(n => !n.read).length > 0 && (
          <span style={{ marginRight: 'auto', background: 'var(--danger)', color: 'white', borderRadius: 20, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
            {notifications.filter(n => !n.read).length} جديد
          </span>
        )}
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '12px 14px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 72, borderRadius: 14 }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔕</div>
            <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 6px' }}>لا توجد إشعارات</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>ستظهر هنا إشعارات الطلبات والشحن</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map((n) => (
              <div key={n.id} onClick={() => router.push(n.type === 'order' ? '/orders' : '/wallet')}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                  background: n.read ? 'var(--bg-card)' : 'rgba(0,212,255,0.06)',
                  border: `1px solid ${n.read ? 'var(--border)' : 'rgba(0,212,255,0.2)'}`,
                  transition: 'all 0.2s',
                }}>
                {/* Icon dot */}
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `${ICON_COLOR[n.icon] || '#00D4FF'}18`, border: `1px solid ${ICON_COLOR[n.icon] || '#00D4FF'}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {n.type === 'order' ? '📦' : '💰'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', margin: '0 0 3px', lineHeight: 1.3 }}>{n.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 4px' }}>{n.body}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{timeAgo(n.time)}</p>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4, boxShadow: '0 0 6px var(--primary)' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
