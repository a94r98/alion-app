import Link from 'next/link'
import Image from 'next/image'
import { Shield, Zap, Star, Globe, MessageCircle, ChevronRight } from 'lucide-react'

export default function AboutPage() {
  const features = [
    { icon: '⚡', title: 'شحن فوري', desc: 'تنفيذ الطلبات خلال دقائق معدودة بدون انتظار' },
    { icon: '🔐', title: 'حماية كاملة', desc: 'نظام حماية متطور بالذكاء الاصطناعي لكشف الاحتيال' },
    { icon: '🤖', title: 'دعم ذكي', desc: 'مساعد AI عربي متاح 24/7 للإجابة على استفساراتك' },
    { icon: '💰', title: 'أسعار تنافسية', desc: 'أفضل الأسعار في السوق مع عروض وخصومات مستمرة' },
    { icon: '📱', title: 'تطبيق أندرويد', desc: 'احمّل التطبيق واستمتع بتجربة أفضل على هاتفك' },
    { icon: '🌍', title: 'متعدد اللغات', desc: 'يدعم العربية، الكردية، والتركية بشكل كامل' },
  ]

  const paymentMethods = [
    { name: 'USDT TRC20', icon: '🪙' },
    { name: 'شام كاش', icon: '💳' },
    { name: 'مكتب الوزاز', icon: '🏢' },
    { name: 'مكتب السوسي', icon: '🏢' },
    { name: 'ويسترن يونيون', icon: '🚀' },
    { name: 'كود شحن', icon: '🎫' },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-deep)', paddingBottom: 40 }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '48px 24px 36px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.12),transparent)', filter: 'blur(40px)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 16px' }}>
            <Image src="/icons/logo.jpg" alt="ALION" fill sizes="80px" style={{ objectFit: 'cover', borderRadius: '50%', filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.4))' }} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>ALION</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 340, margin: '0 auto', lineHeight: 1.6 }}>
            منصة الشحن الرقمي الأذكى والأسرع في المنطقة العربية. شحن الألعاب والتطبيقات والرصيد بثقة وأمان 🦁
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
        {/* Features Grid */}
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>✨ لماذا ALION؟</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 28 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 12px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', marginBottom: 4 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>💳 طرق الدفع المتاحة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 28 }}>
          {paymentMethods.map((m, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{m.icon}</div>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>{m.name}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.08),rgba(255,215,0,0.05))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 18, padding: '20px 16px', marginBottom: 28 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, textAlign: 'center' }}>📊 بالأرقام</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, textAlign: 'center' }}>
            {[
              { v: '+12,500', l: 'مستخدم' },
              { v: '+98,000', l: 'طلب منجز' },
              { v: '+36', l: 'خدمة' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg,#00D4FF,#FFD700)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>📞 تواصل معنا</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {[
            { icon: '📱', label: 'واتساب', sub: 'دعم فني مباشر', href: 'https://wa.me/1234567890' },
            { icon: '✈️', label: 'تيليجرام', sub: '@alion_support', href: 'https://t.me/alion_support' },
            { icon: '🌐', label: 'الموقع', sub: 'alion-app.com', href: 'https://alion-app.com' },
          ].map((c, i) => (
            <a key={i} href={c.href} target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 14px',
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, textDecoration: 'none',
            }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{c.label}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.sub}</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </a>
          ))}
        </div>

        <Link href="/" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg,#00D4FF,#0080FF)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 15 }}>
          ابدأ الشحن الآن 🚀
        </Link>
      </div>
    </div>
  )
}
