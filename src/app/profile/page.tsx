'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, Wallet, Shield, Globe, Moon, LogOut, ChevronLeft, ChevronRight, MessageCircle, Info } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'

const menuItems = [
  { icon: ShoppingBag, label: 'طلباتي', sub: 'سجل جميع طلباتك', href: '/orders', color: '#00D4FF' },
  { icon: Wallet, label: 'محفظتي', sub: 'الرصيد وإضافة رصيد', href: '/wallet', color: '#00E676' },
  { icon: Shield, label: 'تحقق الهوية KYC', sub: 'رفع هويتك لحدود أعلى', href: '/kyc', color: '#FFD700' },
  { icon: MessageCircle, label: 'تواصل معنا', sub: 'الدعم الفني - واتساب', href: 'https://wa.me/1234567890', color: '#25D366', external: true },
  { icon: Info, label: 'من نحن', sub: 'معلومات عن ALION', href: '/about', color: '#9B59B6' },
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  const handleSignOut = () => signOut({ callbackUrl: '/auth/login' })

  if (status === 'loading') return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const userInitial = session?.user?.name?.charAt(0) || '؟'
  const userName = session?.user?.name || 'مستخدم'
  const userEmail = session?.user?.email || ''

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>حسابي</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 14px' }}>
        {/* Profile card */}
        <div style={{ background: 'linear-gradient(135deg,#0A1525,#0D1E3A)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, padding: '22px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.12),transparent)', filter: 'blur(20px)' }} />

          {/* Avatar */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#00D4FF,#0080FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
            {userInitial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', marginBottom: 3 }}>{userName}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{userEmail}</p>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: 'rgba(0,212,255,0.12)', color: 'var(--primary)', border: '1px solid rgba(0,212,255,0.25)' }}>
              عضو نشط
            </span>
          </div>

          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$0.00</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>رصيدي</p>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'الطلبات', value: '0', icon: '📦' },
            { label: 'مكتمل', value: '0', icon: '✅' },
            { label: 'المنفق', value: '$0', icon: '💰' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden', marginBottom: 14 }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon
            const isLast = i === menuItems.length - 1
            const content = (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: isLast ? 'none' : '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.2s' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `${item.color}18`, border: `1px solid ${item.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 1 }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</p>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            )
            return item.external ? (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>{content}</a>
            ) : (
              <Link key={i} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>{content}</Link>
            )
          })}
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut} style={{ width: '100%', padding: '14px', borderRadius: 14, border: '1px solid rgba(255,82,82,0.3)', background: 'rgba(255,82,82,0.08)', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <LogOut size={18} />
          تسجيل الخروج
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 14 }}>ALION Platform v1.0 · جميع الحقوق محفوظة</p>
      </div>

      <BottomNav />
    </div>
  )
}
