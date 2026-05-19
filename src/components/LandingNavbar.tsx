'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { useAccount } from 'wagmi'
import styles from './LandingNavbar.module.css'

export default function LandingNavbar() {
  const { isConnected } = useAccount()
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="Archetypes Logo" style={{ width: '28px', height: '28px' }} />
            <span className={styles.logoText}>ARCHETYPES</span>
          </Link>
        </div>
        
        <div className={styles.right}>
          <Link href="/dashboard" className={styles.navLink}>
            <Zap size={14} />
            {isConnected ? 'DASHBOARD' : 'LOGIN'}
          </Link>
          <Link href="/missions" className={styles.menuBtn}>
            <span className={styles.dots}>
              <span></span><span></span>
              <span></span><span></span>
            </span>
            EXPLORE
          </Link>
        </div>
      </div>
    </nav>
  )
}
