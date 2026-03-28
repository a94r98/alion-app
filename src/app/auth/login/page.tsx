'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('البريد الإلكتروني أو كلمة السر غير صحيحة')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(ellipse at top, #0A1525 0%, #050A14 60%)',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.12), transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 390, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 12px' }}>
            <Image src="/icons/logo.jpg" alt="ALION" fill sizes="72px"
              style={{ objectFit: 'cover', borderRadius: '50%', filter: 'drop-shadow(0 0 18px rgba(0,212,255,0.5))' }} />
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 900, margin: '0 0 4px',
            background: 'linear-gradient(135deg, #00D4FF, #FFD700)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>ALION</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>تسجيل الدخول إلى حسابك</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(15,25,41,0.85)',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 22,
          padding: '24px 20px',
          backdropFilter: 'blur(20px)',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(10,16,32,0.6)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  borderRadius: 12, padding: '12px 14px',
                  color: 'var(--text-primary)', fontSize: 14,
                  fontFamily: 'Cairo, sans-serif', outline: 'none',
                  WebkitAppearance: 'none',
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>
                كلمة السر
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: 'rgba(10,16,32,0.6)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    borderRadius: 12, padding: '12px 14px', paddingLeft: 44,
                    color: 'var(--text-primary)', fontSize: 14,
                    fontFamily: 'Cairo, sans-serif', outline: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', padding: 0,
                }}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)',
              }}>
                <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #00D4FF, #0080FF)',
              color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 15,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, marginTop: 2,
            }}>
              <LogIn size={17} />
              {loading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          {/* Social Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.1)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>أو من خلال</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.1)' }} />
          </div>

          {/* Google Login */}
          <button
            onClick={() => signIn('google')}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)',
              color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            تسجيل الدخول بواسطة جوجل
          </button>

          <div style={{ marginTop: 18, textAlign: 'center', borderTop: '1px solid rgba(0,212,255,0.08)', paddingTop: 14 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ليس لديك حساب؟ </span>
            <Link href="/auth/register" style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
              سجّل الآن
            </Link>
          </div>
        </div>

        {/* Admin hint */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--text-muted)' }}>
          Admin: admin@alion-app.com
        </p>
      </div>
    </div>
  )
}
