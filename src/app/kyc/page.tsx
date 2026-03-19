'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import BottomNav from '@/components/shared/BottomNav'

export default function KYCPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [files, setFiles] = useState<{ front?: File; back?: File; selfie?: File }>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  const handleSubmit = async () => {
    if (!files.front) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  const UploadBox = ({ fileKey, label, emoji }: { fileKey: 'front' | 'back' | 'selfie'; label: string; emoji: string }) => (
    <label style={{ display: 'block', cursor: 'pointer' }}>
      <input type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => setFiles(f => ({ ...f, [fileKey]: e.target.files?.[0] }))} />
      <div style={{
        padding: '18px 14px',
        borderRadius: 14,
        border: `2px dashed ${files[fileKey] ? '#00E676' : 'rgba(0,212,255,0.3)'}`,
        background: files[fileKey] ? 'rgba(0,230,118,0.06)' : 'rgba(0,212,255,0.04)',
        textAlign: 'center',
        transition: 'all 0.2s',
      }}>
        <div style={{ fontSize: 32, marginBottom: 8, lineHeight: 1 }}>
          {files[fileKey] ? '✅' : emoji}
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px', color: files[fileKey] ? '#00E676' : 'var(--text-secondary)' }}>
          {files[fileKey] ? files[fileKey]!.name.slice(0, 20) + '...' : label}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
          {files[fileKey] ? 'اضغط للتغيير' : 'اضغط لرفع صورة'}
        </p>
      </div>
    </label>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(5,10,20,0.95)', borderBottom: '1px solid var(--border)',
        padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>🪪 تحقق الهوية KYC</span>
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '20px 16px' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px' }}>
              تم إرسال طلبك ✅
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              سيتم مراجعة هويتك خلال 24 ساعة<br />ستصلك إشعار عند الموافقة
            </p>
            <button onClick={() => router.push('/')} style={{
              padding: '12px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #00D4FF, #0080FF)',
              color: 'white', border: 'none',
              fontFamily: 'Cairo, sans-serif', fontWeight: 700, cursor: 'pointer', fontSize: 14,
            }}>
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <>
            {/* Benefits Card */}
            <div style={{
              background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 18, padding: '16px 14px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)', margin: '0 0 10px' }}>
                🛡️ لماذا التحقق من الهوية؟
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  '✅ رفع حد الشحن اليومي',
                  '✅ الحصول على مزايا VIP حصرية',
                  '✅ حماية حسابك من الاحتيال',
                  '✅ تسريع معالجة الطلبات',
                ].map((b, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{b}</p>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
              📋 ارفع المستندات
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <UploadBox fileKey="front" label="وجه الهوية / جواز السفر *" emoji="💳" />
              <UploadBox fileKey="back" label="ظهر الهوية (اختياري)" emoji="💳" />
              <UploadBox fileKey="selfie" label="سيلفي + الهوية في يدك" emoji="🤳" />
            </div>

            {/* Warning */}
            <div style={{
              background: 'rgba(255,179,0,0.08)', border: '1px solid rgba(255,179,0,0.25)',
              borderRadius: 12, padding: '10px 14px', marginBottom: 18,
            }}>
              <p style={{ fontSize: 11, color: '#FFB300', margin: 0 }}>
                ⚠️ تأكد من وضوح الصورة وظهور جميع البيانات. سيتم رفض الصور غير الواضحة.
              </p>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading || !files.front} style={{
              width: '100%', padding: '13px', borderRadius: 12, border: 'none',
              background: files.front ? 'linear-gradient(135deg, #00D4FF, #0080FF)' : 'var(--bg-surface)',
              color: files.front ? 'white' : 'var(--text-muted)',
              fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 15,
              cursor: files.front ? 'pointer' : 'not-allowed',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? '⏳ جاري الإرسال...' : '📤 إرسال للمراجعة'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
