'use client'
import { useState } from 'react'
import { X, ShoppingCart, AlertCircle, LogIn, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// ─── App-specific emoji + color system ───
const APP_STYLES: Record<string, { emoji: string; color: string; bg: string }> = {
  'pubg':       { emoji: '🎯', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'ببجي':       { emoji: '🎯', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'free fire':  { emoji: '🔥', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'فري فاير':   { emoji: '🔥', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'فر فاير':    { emoji: '🔥', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'ourtalk':    { emoji: '🗣️', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'اورتوك':     { emoji: '🗣️', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'wadichat':   { emoji: '💎', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  'وادي':       { emoji: '💎', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  'vilaa':      { emoji: '👑', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'فيلا':       { emoji: '👑', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'waaw':       { emoji: '🌊', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'واو':        { emoji: '🌊', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'wechill':    { emoji: '❄️', color: '#7EC8E3', bg: 'rgba(126,200,227,0.12)' },
  'ويشيل':      { emoji: '❄️', color: '#7EC8E3', bg: 'rgba(126,200,227,0.12)' },
  'pota':       { emoji: '🎪', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
  'بوتا':       { emoji: '🎪', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
  'wyak':       { emoji: '🎭', color: '#E91E63', bg: 'rgba(233,30,99,0.12)' },
  'وياك':       { emoji: '🎭', color: '#E91E63', bg: 'rgba(233,30,99,0.12)' },
  'cocco':      { emoji: '🦋', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  'كوكو':       { emoji: '🦋', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  'yudo':       { emoji: '🎵', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'يودو':       { emoji: '🎵', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'roka':       { emoji: '🚀', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'روكا':       { emoji: '🚀', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'hapi':       { emoji: '😊', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'هابي':       { emoji: '😊', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'rooh':       { emoji: '🌙', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  'روح':        { emoji: '🌙', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
  'yoki':       { emoji: '🦊', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
  'يوكي':       { emoji: '🦊', color: '#FF9800', bg: 'rgba(255,152,0,0.12)' },
  'ume':        { emoji: '🌸', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'يومي':       { emoji: '🌸', color: '#FF6B35', bg: 'rgba(255,107,53,0.12)' },
  'nahki':      { emoji: '⚡', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'ناهكي':      { emoji: '⚡', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'crush':      { emoji: '💖', color: '#E91E63', bg: 'rgba(233,30,99,0.12)' },
  'كراش':       { emoji: '💖', color: '#E91E63', bg: 'rgba(233,30,99,0.12)' },
  'pk star':    { emoji: '⭐', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'بي كي':      { emoji: '⭐', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'oloo':       { emoji: '🌈', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  'أولو':       { emoji: '🌈', color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
  'mtn':        { emoji: '📡', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' },
  'syratel':    { emoji: '📶', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
  'سيريتل':     { emoji: '📶', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' },
}

export function getAppStyle(name: string, type: string): { emoji: string; color: string; bg: string } {
  const lower = (name || '').toLowerCase()
  const key = Object.keys(APP_STYLES).find(k => lower.includes(k))
  if (key) return APP_STYLES[key]
  if (type === 'game') return { emoji: '🎮', color: '#00D4FF', bg: 'rgba(0,212,255,0.12)' }
  if (type === 'chat') return { emoji: '💬', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' }
  return { emoji: '📞', color: '#FFD700', bg: 'rgba(255,215,0,0.12)' }
}

// ─── Chat app defaults ───
const DEFAULT_MIN = 1000
const DEFAULT_MAX = 5000000

interface ProductModalProps { product: any; onClose: () => void }

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { data: session } = useSession()
  const router = useRouter()

  // Shared
  const [idInput, setIdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  // Games / Telecom
  const [quantity, setQuantity] = useState(1)

  // Chat apps
  const [amountStr, setAmountStr] = useState('')

  const appStyle = getAppStyle(product.nameAr || product.name || '', product.type)
  const isChatApp = product.type === 'chat'
  const isTelecom = product.type === 'telecom'

  // Chat min/max
  const chatMin: number = (product.metadata as any)?.minAmount || DEFAULT_MIN
  const chatMax: number = (product.metadata as any)?.maxAmount || DEFAULT_MAX
  const parsedAmt = parseInt(amountStr) || 0

  // Live validation error for chat amount
  const amountErr = isChatApp && amountStr.length > 0
    ? parsedAmt < chatMin
      ? `يجب ان تكون الكمية اكبر من ${chatMin.toLocaleString()}`
      : parsedAmt > chatMax
        ? `يجب ان تكون الكمية اصغر من ${chatMax.toLocaleString()}`
        : ''
    : ''

  const amountValid = isChatApp ? (parsedAmt >= chatMin && parsedAmt <= chatMax) : true

  // Price
  const price: number = isChatApp
    ? (product.price || 0.001) * parsedAmt
    : (product.price || 0.5) * quantity

  const priceDisplay = (isChatApp && (!amountValid || !amountStr))
    ? '!!!'
    : `$${price.toFixed(2)}`

  const priceIsError = priceDisplay === '!!!'

  // ─── Submit ───
  const handleOrder = async () => {
    if (!session) { router.push('/auth/login'); return }
    if (!idInput.trim()) { setFormError('يرجى إدخال ' + (isTelecom ? 'رقم الهاتف' : 'الايدي')); return }
    if (isChatApp && !amountValid) { setFormError('يرجى إدخال كمية صحيحة'); return }
    if (isChatApp && !amountStr) { setFormError('يرجى إدخال العدد'); return }

    setLoading(true); setFormError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          inputValue: idInput,
          quantity: isChatApp ? parsedAmt : quantity,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'حدث خطأ')
      setOrderId(data.orderId || '#' + Math.random().toString(36).slice(2, 8).toUpperCase())
      setSuccess(true)
    } catch (e: any) {
      setFormError(e.message)
    } finally { setLoading(false) }
  }

  const inputCss: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '12px 14px',
    color: '#fff', fontSize: 15, fontFamily: 'Cairo, sans-serif',
    outline: 'none', textAlign: 'center',
    WebkitAppearance: 'none',
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

      <div style={{ width: '100%', maxWidth: 480, background: '#0B1525', borderRadius: '24px 24px 0 0', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none', maxHeight: '94dvh', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s cubic-bezier(.2,.8,.3,1)' }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* ─── SUCCESS ─── */}
        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 40px', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,230,118,0.1)', border: '2px solid #00E676', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 36 }}>✅</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>تم الطلب بنجاح! 🎉</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 20px', lineHeight: 1.7 }}>
              سيتم تنفيذ طلبك خلال دقائق<br />
              رقم الطلب: <strong style={{ color: '#00D4FF' }}>{orderId}</strong>
            </p>
            <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 14px', marginBottom: 20, textAlign: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{product.nameAr}</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#00D4FF' }}>${price.toFixed(2)}</span>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                الايدي: {idInput} {isChatApp ? `· ${parsedAmt.toLocaleString()} وحدة` : `· ×${quantity}`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button onClick={() => { onClose(); router.push('/orders') }} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: '#fff', border: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                متابعة طلبي
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          /* ─── PURCHASE ─── */
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 16px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: appStyle.bg, border: `1px solid ${appStyle.color}33`, flexShrink: 0 }}>
                  {appStyle.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 900, margin: '0 0 3px', color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>
                    {product.nameAr || product.name}
                  </h2>
                  {product.badge === 'أوتوماتيك' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#00E676', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                      <Zap size={9} /> يعمل أوتوماتيك
                    </span>
                  )}
                </div>
              </div>
              <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
              </button>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px 14px' }} />

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>

              {/* ─── ID Field ─── */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                  {isTelecom ? '📞 رقم الهاتف' : '🆔 الايدي'}
                </label>
                <input
                  type={isTelecom ? 'tel' : 'text'}
                  placeholder={isTelecom ? 'أدخل رقم الهاتف...' : 'أدخل الايدي...'}
                  value={idInput}
                  onChange={e => { setIdInput(e.target.value); setFormError('') }}
                  style={{ ...inputCss, borderColor: formError && !idInput ? 'rgba(255,82,82,0.5)' : 'rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* ─── CHAT: Amount input ─── */}
              {isChatApp ? (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                    💎 العدد
                  </label>
                  <input
                    type="number"
                    placeholder={`الحد الأدنى ${chatMin.toLocaleString()}`}
                    value={amountStr}
                    onChange={e => { setAmountStr(e.target.value); setFormError('') }}
                    style={{
                      ...inputCss,
                      borderColor: amountErr ? 'rgba(255,82,82,0.5)' : 'rgba(255,255,255,0.1)',
                    }}
                  />
                  {amountErr && (
                    <p style={{ fontSize: 12, color: '#FF5252', marginTop: 6, textAlign: 'center' }}>{amountErr}</p>
                  )}
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', margin: '5px 0 0', textAlign: 'center' }}>
                    الحد الأقصى: {chatMax.toLocaleString()}
                  </p>
                </div>
              ) : (
                /* ─── GAMES/TELECOM: Quantity ─── */
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>الكمية</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ width: 40, height: 40, borderRadius: 12, fontSize: 22, background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <div style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 900, color: appStyle.color }}>{quantity}</div>
                    <button onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      style={{ width: 40, height: 40, borderRadius: 12, fontSize: 18, background: appStyle.color, color: appStyle.color === '#FFD700' ? '#050A14' : '#fff', border: 'none', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
              )}

              {/* ─── Form error ─── */}
              {formError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', marginBottom: 12 }}>
                  <AlertCircle size={14} style={{ color: '#FF5252', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#FF5252' }}>{formError}</span>
                </div>
              )}

              {/* ─── Not logged in ─── */}
              {!session && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', marginBottom: 12 }}>
                  <LogIn size={14} style={{ color: '#00D4FF', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#00D4FF' }}>يجب تسجيل الدخول أولاً للشراء</span>
                </div>
              )}

              {/* ─── Total + Buy ─── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: '0 0 2px' }}>الإجمالي</p>
                  <p style={{
                    fontSize: 28, fontWeight: 900, margin: 0,
                    color: priceIsError ? '#FF5252' : 'transparent',
                    background: priceIsError ? 'none' : 'linear-gradient(135deg,#00D4FF,#FFD700)',
                    WebkitBackgroundClip: priceIsError ? 'unset' : 'text',
                    WebkitTextFillColor: priceIsError ? '#FF5252' : 'transparent',
                  }}>
                    {priceDisplay}
                  </p>
                </div>
                <button onClick={handleOrder}
                  disabled={loading || (isChatApp && !amountValid)}
                  style={{
                    padding: '13px 22px', borderRadius: 14, border: 'none',
                    cursor: (loading || (isChatApp && !amountValid)) ? 'not-allowed' : 'pointer',
                    background: (loading || (isChatApp && !amountValid))
                      ? 'rgba(255,255,255,0.07)'
                      : 'linear-gradient(135deg,#00D4FF,#0080FF)',
                    color: (loading || (isChatApp && !amountValid)) ? 'rgba(255,255,255,0.25)' : '#fff',
                    fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 15,
                    display: 'flex', alignItems: 'center', gap: 8,
                    boxShadow: (loading || (isChatApp && !amountValid)) ? 'none' : '0 4px 18px rgba(0,212,255,0.3)',
                    transition: 'all 0.2s',
                  }}>
                  {loading ? '⏳ جاري...' : <><ShoppingCart size={17} /> شراء</>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform:translateY(100%); opacity:0 } to { transform:translateY(0); opacity:1 } }`}</style>
    </div>
  )
}
