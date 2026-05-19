import { User as UserIcon, Award, CheckCircle, ExternalLink, Clock, XCircle } from 'lucide-react'
import styles from './profile.module.css'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import ProfileSidebar from './ProfileSidebar'
import { ARCHETYPES_CONFIG, getArchetypeStats, getLevelInfo } from '@/lib/archetypes'

export default async function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address: rawAddress } = await params
  const address = rawAddress.toLowerCase()

  const user = await db.query.users.findFirst({
    where: eq(users.address, address),
    with: {
      contributorProfile: true,
      submissions: {
        with: { 
          mission: { 
            with: { protocol: true } 
          },
          proofs: true,
          reviews: true
        }
      },
      badges: {
        with: { 
          badge: true,
          proofs: true
        }
      },
      onChainProofs: true
    }
  })

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>User Not Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>This archetype has not been initialized yet.</p>
          <Link href="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    )
  }

  const archetypeStats = getArchetypeStats(user.submissions || [])
  const levelInfo = getLevelInfo(user.reputation || 0)

  return (
    <div className={styles.profilePageWrapper}>
      <div className={styles.profileLayout}>
        <div className={styles.sidebar}>
          <ProfileSidebar address={address} user={user} />
        </div>

        <div className={styles.main}>
          {/* ── Archetype Progress Section ── */}
          <section className={styles.section}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '4px', height: '24px', background: '#00E5FF' }} />
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em' }}>ARCHETYPE AFFINITY</h2>
            </div>
            
            <div className={styles.archetypeGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {Object.entries(ARCHETYPES_CONFIG).map(([key, config]) => {
                const xp = archetypeStats[config.name] || 0
                const classLevelInfo = getLevelInfo(xp)
                
                return (
                  <div key={key} className={styles.archetypeBarWrapper} style={{ 
                    background: 'rgba(255,255,255,0.01)', 
                    border: '1px solid rgba(255,255,255,0.03)',
                    padding: '1.5rem'
                  }}>
                    <div className={styles.archetypeBarHeader} style={{ marginBottom: '1rem' }}>
                      <div className={styles.archetypeBarLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <config.icon size={16} style={{ color: config.color }} />
                        <span style={{ fontWeight: 900, fontSize: '0.8rem', color: 'white' }}>{config.name.toUpperCase()}</span>
                      </div>
                      <div className={styles.archetypeBarXP} style={{ fontSize: '0.75rem', fontWeight: 900 }}>
                        <span style={{ color: config.color }}>{xp}</span> <span style={{ opacity: 0.2 }}>/ {classLevelInfo.nextThreshold} XP</span>
                      </div>
                    </div>
                    <div className={styles.progressBarContainer} style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '0' }}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ 
                          height: '100%',
                          width: `${Math.max(xp > 0 ? 5 : 0, classLevelInfo.progress)}%`, 
                          backgroundColor: config.color,
                          boxShadow: `0 0 15px ${config.color}40`,
                          borderRadius: '0',
                          transition: 'width 1s ease-out'
                        }} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Recent Contributions ── */}
          <section className={styles.section}>
            <h2>Mission History</h2>
            <div className={styles.history}>
              {user.submissions.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className={styles.emptyText}>No contributions logged in the network.</p>
                </div>
              ) : (
                user.submissions.map((sub: any) => (
                  <Link key={sub.id} href={`/submissions/${sub.id}`} className={styles.historyItem}>
                    <div className={styles.historyMain}>
                      <div className={styles.historyProtocol}>
                        {sub.mission.protocol.name}
                      </div>
                      <h3>{sub.mission.title}</h3>
                      <div className={styles.historyMeta}>
                        <span className={`${styles.statusBadge} ${styles[sub.status.toLowerCase()]}`}>
                          {sub.status}
                        </span>
                        <span>• {new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={styles.historyReward}>
                      <span>+{sub.rewardGranted ?? sub.mission.reputationReward} XP</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* ── Badges Section ── */}
          <section className={styles.section}>
            <h2>On-Chain Artifacts</h2>
            <div className={styles.badges}>
              {user.badges.length === 0 ? (
                <p className={styles.emptyText}>No soulbound artifacts acquired.</p>
              ) : (
                user.badges.map((ub: any) => (
                  <div key={ub.id} className={styles.badgeCard}>
                    <Award size={24} style={{ color: '#00E5FF' }} />
                    <span>{ub.badge.name}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
