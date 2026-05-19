'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, BarChart3, FileText, Settings, Users, ShieldAlert } from 'lucide-react'
import { useAccount } from 'wagmi'
import { getProtocolForAdmin } from '@/actions/users'
import { getProtocolDashboardData } from '@/actions/protocols'
import styles from './protocol.module.css'

export default function ProtocolDashboard() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(true)
  const [protocol, setProtocol] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      const proto = await getProtocolForAdmin(address)
      if (proto) {
        setProtocol(proto)
        const dashData = await getProtocolDashboardData(proto.id)
        if (dashData.success) {
          setData(dashData)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [isConnected, address])

  if (loading) return <div className="container" style={{ padding: '4rem' }}><p>Initializing terminal...</p></div>

  if (!isConnected) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.2)' }} />
        <h2>Connect Wallet</h2>
        <p>Please connect your wallet to access the Protocol Dashboard.</p>
      </div>
    )
  }

  if (!protocol) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.2)' }} />
        <h2>Access Denied</h2>
        <p>You are not currently registered as a Protocol Admin.</p>
        <Link href="/protocols/apply" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Register a Protocol
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <div className={styles.dashboardHeader}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            fontSize: '1.5rem',
            fontWeight: 900
          }}>
            {protocol.logoUrl ? (
              <img src={protocol.logoUrl} alt={protocol.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              protocol.name.charAt(0)
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
              PROTOCOL ADMIN
            </div>
            <h1>{protocol.name}</h1>
            <p>Manage your campaigns, missions, and contributor quality.</p>
          </div>
        </div>
        <Link href="/dashboard/protocol/missions/create" className="btn-primary">
          <Plus size={18} />
          Create Mission
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <Users size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Total Contributors</span>
            <span className={styles.statValue}>{data?.stats.totalContributors || 0}</span>
          </div>
        </div>
        
        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <FileText size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Active Missions</span>
            <span className={styles.statValue}>{data?.stats.totalActiveMissions || 0}</span>
          </div>
        </div>

        <div className={`${styles.statCard} glass-panel`}>
          <div className={styles.statIcon}>
            <BarChart3 size={20} />
          </div>
          <div className={styles.statData}>
            <span className={styles.statLabel}>Total Rep Issued</span>
            <span className={styles.statValue}>{data?.stats.totalRepIssued || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Pending Submissions</h2>
            <Link href="/dashboard/protocol/reviews" className={styles.viewAll}>View all ({data?.stats.pendingReviews || 0})</Link>
          </div>
          
          {data?.stats.pendingReviews === 0 ? (
            <div className={styles.emptyTable}>
              <p>No submissions awaiting review.</p>
            </div>
          ) : (
            <div className={styles.emptyTable} style={{ display: 'block', textAlign: 'left', padding: '1rem' }}>
              <p style={{ marginBottom: '1rem' }}>You have {data?.stats.pendingReviews} submissions waiting for your approval.</p>
              <Link href="/dashboard/protocol/reviews" className="btn-primary" style={{ display: 'inline-flex' }}>
                Review Submissions
              </Link>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Active Missions</h2>
          </div>
          {data?.missions?.filter((m:any) => m.status === 'PUBLISHED').length === 0 ? (
            <div className={styles.emptyTable}>
              <p>You haven't published any missions yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data?.missions?.filter((m:any) => m.status === 'PUBLISHED').slice(0, 3).map((mission: any) => (
                <div key={mission.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{mission.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{mission.category} • +{mission.reputationReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

