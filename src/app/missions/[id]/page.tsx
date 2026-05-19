import { ArrowLeft, Clock, Award, Shield, Globe, Send } from 'lucide-react'
import Link from 'next/link'
import styles from './mission-detail.module.css'
import { db } from '@/db'
import { missions as missionsTable, protocols } from '@/db/schema'
import { eq } from 'drizzle-orm'
import AdminMissionControls from '@/components/AdminMissionControls'

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const results = await db.select({
    mission: missionsTable,
    protocol: protocols
  })
  .from(missionsTable)
  .innerJoin(protocols, eq(missionsTable.protocolId, protocols.id))
  .where(eq(missionsTable.id, id))
  .limit(1)

  const data = results[0]

  if (!data) {
    return (
      <div className="container">
        <div className={styles.notFound}>
          <h1>Mission Not Found</h1>
          <p>The mission you are looking for does not exist or has been archived.</p>
          <Link href="/missions" className="btn-primary">Back to Board</Link>
        </div>
      </div>
    )
  }

  const { mission, protocol } = data

  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.main}>
          <Link href="/missions" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Board
          </Link>

          <AdminMissionControls missionId={mission.id} />

          <div className={styles.header}>
            <div className={styles.protocolInfo}>
              {protocol.logoUrl && (
                <img src={protocol.logoUrl} alt={protocol.name} style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
              )}
              <span className={styles.protocolName}>{protocol.name}</span>
              {protocol.isVerified && <Shield size={14} color="var(--accent-primary)" />}
            </div>
            <h1>{mission.title}</h1>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Clock size={16} />
                <span>Deadline: {mission.deadline 
                  ? (mission.deadline instanceof Date ? mission.deadline.toLocaleDateString() : new Date(mission.deadline).toLocaleDateString()) 
                  : 'Rolling'}</span>
              </div>
              <div className={styles.metaItem}>
                <Globe size={16} />
                <span>Category: {mission.category}</span>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2>Overview</h2>
              <p>{mission.description}</p>
            </section>

            <section className={styles.section}>
              <h2>Requirements</h2>
              <ul className={styles.list}>
                {mission.requirements.split('\n').map((req: string, i: number) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={`${styles.rewardCard} glass-panel`}>
            <h3>Mission Reward</h3>
            <div className={styles.rewardValue}>
              <Award size={24} color="var(--accent-primary)" />
              <span>+{mission.reputationReward} REP</span>
            </div>
            <p>Non-transferable reputation points awarded upon manual review.</p>
            
            <div className={styles.divider}></div>
            
            {mission.isFaucetEnabled && (
              <div className={styles.faucetNote}>
                <Shield size={16} />
                <span>Faucet utility available for this mission.</span>
              </div>
            )}

            <Link 
              href={`/missions/${mission.id}/submit`}
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Submit
              <Send size={18} />
            </Link>
          </div>

          <div className={`${styles.protocolCard} glass-panel`}>
            <h3>About {protocol.name}</h3>
            <p>{protocol.description}</p>
            <Link href={`/protocols/${protocol.slug}`} className={styles.protocolLink}>
              View Protocol Profile
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
