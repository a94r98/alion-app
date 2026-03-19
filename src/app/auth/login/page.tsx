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
