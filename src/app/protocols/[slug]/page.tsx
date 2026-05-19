import { Globe, MessageCircle, Shield, Users, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import styles from './protocol-page.module.css'
import { db } from '@/db'
import { protocols } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function ProtocolPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const protocol = await db.query.protocols.findFirst({
    where: eq(protocols.slug, slug),
    with: {
      missions: {
        where: (missions, { eq }) => eq(missions.status, 'PUBLISHED')
      }
    }
  })

  if (!protocol) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h1>Protocol Not Found</h1>
          <p>This protocol has not joined the network yet or is currently under review.</p>
          <Link href="/protocols" className="btn-primary">Back to Protocols</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.logoBox}>
              {protocol.name.charAt(0)}
            </div>
            <div className={styles.titleInfo}>
              <div className={styles.nameRow}>
                <h1>{protocol.name}</h1>
                {protocol.isVerified && <Shield size={20} color="var(--accent-primary)" />}
              </div>
              <p>{protocol.description}</p>
            </div>
          </div>
          
          <div className={styles.links}>
            {protocol.website && (
              <Link href={protocol.website} target="_blank" className="btn-secondary">
                <Globe size={18} />
                Website
              </Link>
            )}
            {protocol.twitter && (
              <Link href={`https://twitter.com/${protocol.twitter}`} target="_blank" className="btn-secondary">
                <MessageCircle size={18} />
                Twitter
              </Link>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.main}>
            <h2>Active Missions</h2>
            {protocol.missions.length === 0 ? (
              <div className={styles.emptyMissions}>
                <p>No active missions at the moment.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {protocol.missions.map((mission: any) => (
                  <Link key={mission.id} href={`/missions/${mission.id}`} className={`${styles.missionCard} glass-panel`}>
                    <h3>{mission.title}</h3>
                    <div className={styles.missionMeta}>
                      <span className="badge">{mission.difficulty}</span>
                      <span className={styles.reward}>+{mission.reputationReward} REP</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className={styles.sidebar}>
            <div className={`${styles.statCard} glass-panel`}>
              <h3>Protocol Ecosystem</h3>
              <div className={styles.statItem}>
                <Users size={18} />
                <span>0 Total Contributors</span>
              </div>
              <div className={styles.statItem}>
                <Shield size={18} />
                <span>Verified since {protocol.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
