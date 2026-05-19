'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, Clock, CheckCircle, Search } from 'lucide-react'
import { useAccount } from 'wagmi'
import { syncUser, getContributorStats } from '@/actions/users'
import { getLevelInfo } from '@/lib/archetypes'
import ArchetypeOnboarding from '@/components/ArchetypeOnboarding'
import styles from './contributor.module.css'

export default function ContributorDashboard() {
  const { address, isConnected } = useAccount()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (isConnected && address) {
      syncUser(address).then(res => {
        if (res.success && !res.chosenArchetype) {
          setShowOnboarding(true)
        }
        
        getContributorStats(address).then(data => {
          setStats(data)
          setLoading(false)
        })
      })
    }
  }, [isConnected, address])

  if (loading) return <div className="container" style={{ padding: '4rem' }}><p>Initializing terminal...</p></div>
  if (showOnboarding) return <ArchetypeOnboarding onComplete={() => setShowOnboarding(false)} />

  const levelInfo = getLevelInfo(stats?.reputation || 0)

  return (
    <div className="container">
      <div className={styles.dashboardHeader}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            STATUS: ACTIVE • ARCHETYPE: {stats?.chosenArchetype?.toUpperCase() || 'UNDEFINED'}
          </div>
          <h1>CONTRIBUTOR TERMINAL</h1>
          <p>Your on-chain presence is expanding through the Arc network.</p>
        </div>
      </div>

      {/* Premium Progress Bar */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>CURRENT LEVEL</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{levelInfo.level}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>NEXT LEVEL</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>{stats?.reputation || 0} / {levelInfo.nextThreshold} XP</div>
          </div>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ width: `${levelInfo.progress}%`, height: '100%', background: 'linear-gradient(90deg, #00E5FF, #00B2FF)', boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)' }} />
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <Award size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Total Reputation</span>
            <span className={styles.statValue}>{stats?.reputation || 0}</span>
          </div>
        </div>
        
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <Clock size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Pending Reviews</span>
            <span className={styles.statValue}>{stats?.pendingReviews || 0}</span>
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <CheckCircle size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Completed Missions</span>
            <span className={styles.statValue}>{stats?.completedMissions || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Active Missions</h2>
            <Link href="/missions" className={styles.viewAll}>Find more</Link>
          </div>
          <div className={styles.emptyTable}>
            <p>You have no active missions. Explore the board to start contributing.</p>
            <Link href="/missions" className="btn-secondary" style={{ marginTop: '1rem' }}>
              Mission Board
            </Link>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recent Activity</h2>
          </div>
          <div className={styles.emptyTable}>
            <p>No recent activity found.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
