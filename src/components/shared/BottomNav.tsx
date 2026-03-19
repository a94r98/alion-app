'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, User, ShoppingBag, Wallet } from 'lucide-react'
import { useSession } from 'next-auth/react'

const navItems = [
  { href: '/', icon: Home, label: 'الرئيسية' },
  { href: '/orders', icon: ShoppingBag, label: 'طلباتي' },
  { href: '/wallet', icon: Wallet, label: 'محفظتي', center: true },
  { href: '/categories', icon: Grid3X3, label: 'الفئات' },
  { href: '/profile', icon: User, label: 'حسابي' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        if (item.center) {
          return (
            <Link key={item.href} href={session ? item.href : '/auth/login'}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginTop: -24, textDecoration: 'none',
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, #00D4FF 0%, #0080FF 100%)',
                boxShadow: '0 0 18px rgba(0,212,255,0.4), 0 4px 12px rgba(0,0,0,0.3)',
              }}>
                <Icon size={22} color="white" />
              </div>
              <span style={{ fontSize: 10, marginTop: 2, fontWeight: 700, color: 'var(--primary)' }}>
                {item.label}
              </span>
            </Link>
          )
        }

        return (
          <Link key={item.href} href={item.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 8px', borderRadius: 10,
              textDecoration: 'none',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              minWidth: 0, flex: 1,
            }}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} />
              {isActive && (
                <span style={{
                  position: 'absolute', top: -2, right: -2,
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--primary)',
                }} />
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
