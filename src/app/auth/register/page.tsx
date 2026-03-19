'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password.length < 8) { setError('كلمة السر يجب أن تكون 8 أحرف على الأقل'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/auth/login'), 1500)
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const inputStyle = {
    background: 'rgba(15,25,41,0.8)', border: '1px solid rgba(0,212,255,0.1)',
    borderRadius: 12, padding: '11px 14px', color: 'var(--text-primary)',
    fontFamily: 'Cairo, sans-serif', fontSize: 14, width: '100%', outline: 'none',
    WebkitAppearance: 'none' as const, boxSizing: 'border-box' as const,
  }
  const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', background: 'radial-gradient(ellipse at top,#0A1525 0%,#050A14 60%)' }}>
      <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.12),transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 70, height: 70, marginBottom: 10 }}>
            <Image src="/icons/logo.jpg" alt="ALION" fill sizes="70px" className="object-contain rounded-full"
              style={{ filter: 'drop-shadow(0 0 16px rgba(0,212,255,0.4))' }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ALION</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>إنشاء حساب جديد</p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(15,25,41,0.8)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 20, padding: '24px 20px', backdropFilter: 'blur(20px)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: 16 }}>تم التسجيل بنجاح! 🎉</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>جاري تحويلك لصفحة الدخول...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={labelStyle}>الاسم الأول *</label>
                  <input value={form.firstName} onChange={set('firstName')} placeholder="علي" style={inputStyle} required autoComplete="given-name" />
                </div>
                <div>
                  <label style={labelStyle}>الاسم الأخير</label>
                  <input value={form.lastName} onChange={set('lastName')} placeholder="أحمد" style={inputStyle} autoComplete="family-name" />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="example@email.com" style={inputStyle} required autoComplete="email" />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>رقم الهاتف</label>
                <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+964..." style={inputStyle} autoComplete="tel" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>كلمة السر * (8 أحرف على الأقل)</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    placeholder="••••••••" style={{ ...inputStyle, paddingLeft: 40 }} required minLength={8} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}>
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', marginBottom: 14 }}>
                  <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: 'white',
                fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.7 : 1,
              }}>
                <UserPlus size={18} />
                {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>لديك حساب؟ </span>
            <Link href="/auth/login" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              سجّل الدخول
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
