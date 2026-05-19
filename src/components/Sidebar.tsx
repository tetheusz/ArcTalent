'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Target, 
  ShieldCheck, 
  Plus, 
  User as UserIcon,
  Trophy,
  Package,
  Settings,
  Flame,
  Zap,
  Command,
  ChevronRight
} from 'lucide-react'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { getUserRole } from '@/actions/users'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      getUserRole(address).then(data => setIsAdmin(data.role === 'ADMIN'))
    } else {
      setIsAdmin(false)
    }
  }, [isConnected, address])

  if (pathname === '/') return null

  const mainItems = [
    { name: 'Terminal', href: '/dashboard/contributor', icon: LayoutDashboard },
    { name: 'Identity', href: address ? `/profile/${address}` : '/profile', icon: UserIcon },
    { name: 'Missions', href: '/missions', icon: Target, badge: 'NEW' },
    { name: 'Rankings', href: '/rankings', icon: Trophy },
    { name: 'Inventory', href: '/inventory', icon: Package },
  ]

  const sanctumItems = [
    { name: 'Command Center', href: '/admin/protocols', icon: ShieldCheck },
    { name: 'Review Portal', href: '/admin/reviews', icon: Command },
    { name: 'Forge Mission', href: '/admin/missions/new', icon: Plus },
  ]

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="Archetypes Logo" style={{ width: '32px', height: '32px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em' }}>ARCHETYPES</span>
            <span style={{ fontSize: '0.5rem', color: '#00E5FF', fontWeight: 900, letterSpacing: '0.3em' }}>REPUTATION LAYER</span>
          </div>
        </Link>
      </div>

      <nav className={styles.nav}>
        <div className={styles.category}>
          <div className={styles.categoryLabel}>NAVIGATION</div>
          {mainItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
              <ChevronRight size={14} className={styles.arrow} />
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className={styles.category} style={{ marginTop: '3rem' }}>
            <div className={styles.categoryLabel} style={{ color: '#00E5FF' }}>THE SANCTUM</div>
            {sanctumItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navItem} ${styles.adminItem} ${pathname === item.href ? styles.active : ''}`}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
                <ChevronRight size={14} className={styles.arrow} />
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userStats}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFD700' }}>
            <Flame size={14} />
            <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>STREAK: 0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00E5FF' }}>
            <Zap size={14} fill="#00E5FF" />
            <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>BOOST: 1.0x</span>
          </div>
        </div>
        <div style={{ padding: '1rem' }}>
          <ConnectKitButton />
        </div>
      </div>
    </aside>
  )
}
