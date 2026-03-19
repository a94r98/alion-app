'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Wallet, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ChevronLeft } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'

const paymentMethods = [
  { id: 'usdt1', name: 'USDT TRC20', nameEn: 'Tether USDT', icon: '🪙', color: '#26A17B', instructions: 'أرسل USDT على شبكة TRC20 ثم أرفع إيصال التحويل' },
  { id: 'shamcash', name: 'شام كاش', nameEn: 'Sham Cash', icon: '💳', color: '#E91E63', instructions: 'أرسل عبر شام كاش ثم أرفع لقطة التأكيد' },
  { id: 'office_wazaz', name: 'مكتب الوزاز', nameEn: 'Al-Wazaz Office', icon: '🏢', color: '#FF9800', instructions: 'حوّل عبر مكتب الوزاز - سرمين وأرفع الإيصال' },
  { id: 'office_sousi', name: 'مكتب السوسي', nameEn: 'Al-Sousi Office', icon: '🏢', color: '#9C27B0', instructions: 'حوّل عبر مكتب السوسي - الدانا وأرفع الإيصال' },
  { id: 'western', name: 'ويسترن يونيون', nameEn: 'Western Union', icon: '🚀', color: '#FFD700', instructions: 'أرسل عبر ويسترن يونيون وأرفع صورة الإيصال' },
  { id: 'code', name: 'كود شحن', nameEn: 'Charge Code', icon: '🎫', color: '#00D4FF', instructions: 'أدخل الكود المسبق الشراء مباشرة' },
]

export default function WalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tab, setTab] = useState<'balance' | 'charge'>('balance')
  const [selectedMethod, setSelectedMethod] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [senderNote, setSenderNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  const handleCharge = async () => {
    if (!selectedMethod || !amount || parseFloat(amount) < 1) return
    setLoading(true)
    const fd = new FormData()
    fd.append('method', selectedMethod.id)
    fd.append('amount', amount)
    fd.append('senderNote', senderNote)
    if (proofFile) fd.append('proof', proofFile)
    try {
      const res = await fetch('/api/charges', { method: 'POST', body: fd })
      if (res.ok) { setSuccess(true); setSelectedMethod(null); setAmount(''); setSenderNote(''); setProofFile(null) }
    } finally { setLoading(false) }
  }

  if (status === 'loading') return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}><div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} /></div>

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 40 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>محفظتي</span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 14px' }}>
        {/* Balance Card */}
        <div style={{ marginTop: 16, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#0A1525,#0D1E3A)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.15),transparent)', filter: 'blur(20px)' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>🦁 رصيدك الحالي</p>
            <div style={{ fontSize: 'clamp(28px,8vw,38px)', fontWeight: 900, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>$0.00</div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>الرصيد متاح للشراء فوراً</p>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={() => setTab('charge')} style={{
              flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Plus size={16} /> إضافة رصيد
            </button>
            <Link href="/orders" style={{
              flex: 1, padding: '10px 0', borderRadius: 12, border: '1px solid rgba(0,212,255,0.3)',
              color: 'var(--primary)', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 14, textDecoration: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'rgba(0,212,255,0.07)',
            }}>
              <Wallet size={16} /> طلباتي
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {[{ key: 'balance', label: 'المعاملات' }, { key: 'charge', label: 'إضافة رصيد' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13,
              background: tab === t.key ? 'var(--primary)' : 'var(--bg-card)',
              color: tab === t.key ? 'white' : 'var(--text-secondary)',
              outline: `1px solid ${tab === t.key ? 'transparent' : 'var(--border)'}`,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Transactions tab */}
        {tab === 'balance' && (
          <div style={{ marginTop: 14 }}>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>لا توجد معاملات بعد</p>
                <button onClick={() => setTab('charge')} style={{ marginTop: 14, padding: '10px 24px', borderRadius: 10, background: 'var(--primary)', color: 'white', border: 'none', fontFamily: 'Cairo, sans-serif', fontWeight: 700, cursor: 'pointer' }}>
                  اشحن الآن
                </button>
              </div>
            ) : (
              transactions.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8, borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: t.type === 'credit' ? 'rgba(0,230,118,0.15)' : 'rgba(255,82,82,0.15)' }}>
                    {t.type === 'credit' ? <ArrowDownLeft size={16} style={{ color: 'var(--success)' }} /> : <ArrowUpRight size={16} style={{ color: 'var(--danger)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{t.description}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString('ar')}</p>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 14, color: t.type === 'credit' ? 'var(--success)' : 'var(--danger)' }}>
                    {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Charge tab */}
        {tab === 'charge' && (
          <div style={{ marginTop: 14 }}>
            {success && (
              <div style={{ padding: '14px', borderRadius: 14, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'var(--success)', fontWeight: 700 }}>تم إرسال طلب الشحن! سيتم مراجعته خلال 30 دقيقة ✅</p>
              </div>
            )}

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, fontWeight: 600 }}>اختر طريقة الدفع:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
              {paymentMethods.map(m => (
                <button key={m.id} onClick={() => setSelectedMethod(selectedMethod?.id === m.id ? null : m)}
                  style={{
                    padding: '12px 8px', borderRadius: 14, cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
                    background: selectedMethod?.id === m.id ? `${m.color}22` : 'var(--bg-card)',
                    border: `1px solid ${selectedMethod?.id === m.id ? m.color : 'var(--border)'}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s',
                  }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: selectedMethod?.id === m.id ? m.color : 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.3 }}>{m.name}</span>
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>📋 {selectedMethod.instructions}</p>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>المبلغ (دولار $) *</label>
                  <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="أدخل المبلغ..."
                    style={{ background: 'rgba(15,25,41,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10, padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: 14, width: '100%', outline: 'none', WebkitAppearance: 'none' as any }} />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>ملاحظة (اختياري)</label>
                  <input value={senderNote} onChange={e => setSenderNote(e.target.value)} placeholder="اسم المرسل، رقم المرجع..."
                    style={{ background: 'rgba(15,25,41,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10, padding: '10px 12px', color: 'var(--text-primary)', fontFamily: 'Cairo, sans-serif', fontSize: 14, width: '100%', outline: 'none' }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>صورة الإيصال (مطلوبة)</label>
                  <label style={{ display: 'block', padding: '14px', borderRadius: 10, border: '2px dashed rgba(0,212,255,0.3)', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,212,255,0.04)' }}>
                    <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>{proofFile ? '✅' : '📷'}</span>
                    <span style={{ fontSize: 12, color: proofFile ? 'var(--success)' : 'var(--text-muted)' }}>
                      {proofFile ? proofFile.name : 'اضغط لرفع الصورة'}
                    </span>
                  </label>
                </div>

                <button onClick={handleCharge} disabled={loading || !amount || !proofFile} style={{
                  width: '100%', padding: '13px', borderRadius: 12, border: 'none', cursor: loading || !amount || !proofFile ? 'not-allowed' : 'pointer',
                  background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: 'white', fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 15,
                  opacity: loading || !amount || !proofFile ? 0.6 : 1,
                }}>
                  {loading ? 'جاري الإرسال...' : `إرسال طلب شحن $${amount || '0'}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
