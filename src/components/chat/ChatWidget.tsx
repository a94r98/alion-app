'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string; time: string }

const QUICK_REPLIES = [
  'كيف أشحن محفظتي؟',
  'كيف أشحن ببجي موبايل؟',
  'ما طرق الدفع المتاحة؟',
  'أين سجل طلباتي؟',
]

// Rule-based AI responses (Arabic-first)
function getAIResponse(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('شحن') && (m.includes('محفظ') || m.includes('رصيد'))) {
    return 'لشحن محفظتك اتبع الخطوات:\n1️⃣ اذهب إلى "محفظتي"\n2️⃣ اضغط "إضافة رصيد"\n3️⃣ اختر طريقة الدفع (USDT، شام كاش، حوالة)\n4️⃣ أرسل الإيصال وانتظر تأكيد الإدارة ✅'
  }
  if (m.includes('ببجي') || m.includes('pubg')) {
    return 'لشحن ببجي موبايل:\n1️⃣ اضغط على "ببجي موبايل" من الرئيسية\n2️⃣ اختر الباقة المطلوبة (شدات)\n3️⃣ أدخل معرف اللاعب (Player ID)\n4️⃣ اضغط شراء ✅\n\n⚠️ تأكد من صحة الID قبل الشراء'
  }
  if (m.includes('دفع') || m.includes('طريقة')) {
    return 'طرق الدفع المتاحة:\n💎 USDT TRC20\n💰 شام كاش\n🏦 ويسترن يونيون\n🏢 مكتب الوزاز - سرمين\n🏢 مكتب السوسي - الدانا\n🎫 كود شحن مباشر'
  }
  if (m.includes('طلب') || m.includes('سجل')) {
    return 'يمكنك متابعة طلباتك من:\n📋 القائمة السفلية → "طلباتي"\nستجد فيها:\n✅ الطلبات المنجزة\n⏳ الطلبات قيد المعالجة\n❌ الطلبات المرفوضة'
  }
  if (m.includes('تواصل') || m.includes('دعم') || m.includes('مساعدة')) {
    return 'للتواصل مع فريق الدعم:\n📱 واتساب: متاح من ملف الشركة\n✈️ تيليجرام: @alion_support\n⏰ أوقات العمل: 24/7'
  }
  if (m.includes('hm') || m.includes('hi') || m.includes('هلا') || m.includes('مرحبا') || m.includes('أهلا') || m.includes('السلام')) {
    return `أهلاً وسهلاً بك في ALION! 🦁\nأنا مساعدك الذكي، كيف أقدر أساعدك اليوم؟\n\nيمكنني مساعدتك في:\n🎮 شحن الألعاب\n💬 شحن تطبيقات الدردشة\n📞 شحن الرصيد\n💰 إضافة رصيد للمحفظة`
  }
  return `شكراً على تواصلك مع ALION! 🦁\n\nلم أفهم استفسارك تماماً. يمكنني مساعدتك في:\n• شحن الألعاب والتطبيقات\n• إضافة رصيد للمحفظة\n• معرفة طرق الدفع\n\nلمساعدة أسرع، تواصل مع فريق الدعم المباشر على واتساب 💬`
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'أهلاً! أنا مساعد ALION الذكي 🦁\nكيف أقدر أساعدك؟', time: now() }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  function now() {
    return new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text, time: now() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = getAIResponse(text)
      setMessages(m => [...m, { role: 'assistant', content: reply, time: now() }])
      setTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <>
      {/* Float Button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-20 left-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-xl animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0080FF 100%)' }}>
          <MessageCircle size={24} color="white" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center"
            style={{ background: 'var(--gold)', color: '#000' }}>AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-16 left-0 right-0 z-50 mx-2 rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: '0 -10px 40px rgba(0,212,255,0.15)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div className="flex items-center justify-between p-3"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,128,255,0.1) 100%)',
              borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0080FF 100%)' }}>
                <Bot size={16} color="white" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>مساعد ALION الذكي</div>
                <div className="flex items-center gap-1">
                  <span className="status-dot online" />
                  <span className="text-[10px]" style={{ color: 'var(--success)' }}>متصل الآن</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-xl"
              style={{ background: 'var(--bg-surface)' }}>
              <X size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 modal-scroll" style={{ minHeight: '200px', maxHeight: '350px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} gap-2`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                    style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0080FF 100%)' }}>
                    <Bot size={12} color="white" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className="rounded-2xl p-3 text-sm"
                    style={{
                      background: msg.role === 'user' ? 'var(--bg-surface)' : 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,128,255,0.08) 100%)',
                      border: `1px solid ${msg.role === 'user' ? 'var(--border)' : 'rgba(0,212,255,0.2)'}`,
                      color: 'var(--text-primary)',
                      borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      whiteSpace: 'pre-line',
                    }}>
                    {msg.content}
                  </div>
                  <div className="text-[9px] mt-1 px-1" style={{ color: 'var(--text-muted)' }}>{msg.time}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <User size={12} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex justify-end gap-2">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0080FF 100%)' }}>
                  <Bot size={12} color="white" />
                </div>
                <div className="rounded-2xl px-4 py-3 flex gap-1 items-center"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--primary)', animation: `bounce 1s infinite ${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Replies */}
          <div className="flex gap-2 px-3 pb-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {QUICK_REPLIES.map(qr => (
              <button key={qr} onClick={() => sendMessage(qr)}
                className="text-[10px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--primary)',
                  border: '1px solid rgba(0,212,255,0.3)' }}>
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 pt-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="اكتب رسالتك..."
              className="input-alion flex-1 text-sm py-3"
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: input.trim() ? 'var(--primary)' : 'var(--bg-surface)',
                border: '1px solid var(--border)' }}>
              <Send size={16} color={input.trim() ? 'white' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  )
}
