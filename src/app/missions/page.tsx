import { Target, Zap, Clock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import styles from './missions.module.css'
import { db } from '@/db'
import { missions as missionsTable, protocols as protocolsTable } from '@/db/schema'
import { eq, desc, and, like } from 'drizzle-orm'
import MissionBoardFilters from '@/components/MissionBoardFilters'

export default async function MissionsPage({ searchParams }: { searchParams: Promise<{ q?: string, protocol?: string }> }) {
  const { q, protocol } = await searchParams
  
  const allProtocols = await db.select().from(protocolsTable).where(eq(protocolsTable.isVerified, true))

  const conditions = [eq(missionsTable.status, 'PUBLISHED')]
  
  if (q) {
    conditions.push(like(missionsTable.title, `%${q}%`))
  }
  
  if (protocol && protocol !== 'all') {
    const selectedProtocol = allProtocols.find(p => p.slug === protocol)
    if (selectedProtocol) {
      conditions.push(eq(missionsTable.protocolId, selectedProtocol.id))
    }
  }

  const results = await db.query.missions.findMany({
    where: and(...conditions),
    with: {
      protocol: true
    },
    orderBy: desc(missionsTable.createdAt)
  })

  return (
    <div className={styles.wrapper}>
      {/* Search & Filter Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
        <MissionBoardFilters protocols={allProtocols} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ textAlign: 'right' }}>
             <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, letterSpacing: '0.1em' }}>ACTIVE CAMPAIGNS</div>
             <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{results.length} REALMS</div>
           </div>
           <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
           <Link href="/protocols/apply" className="btn-primary" style={{ fontSize: '0.7rem', padding: '0.75rem 1.5rem' }}>
             ONBOARD PROTOCOL
           </Link>
        </div>
      </div>

      <div className={styles.content} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className={styles.header} style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00E5FF', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em', marginBottom: '1rem' }}>
            <Target size={16} />
            AVAILABLE OBJECTIVES
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '1rem' }}>MISSION BOARD</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>Slay bugs, forge code, and claim your verified on-chain status.</p>
        </div>

        {results.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Sparkles size={48} color="rgba(255,255,255,0.1)" />
            </div>
            <h3>No active missions in the realm</h3>
            <p>The board is currently quiet. Check back soon for new opportunities.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((mission: any) => (
              <Link key={mission.id} href={`/missions/${mission.id}`} className="glass-panel" style={{ 
                display: 'grid', 
                gridTemplateColumns: '80px 1fr 200px', 
                gap: '2rem', 
                padding: '2rem', 
                textDecoration: 'none', 
                color: 'inherit',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 900, 
                    fontSize: '1.5rem', 
                    color: '#00E5FF',
                    overflow: 'hidden'
                  }}>
                    {mission.protocol.logoUrl ? (
                      <img src={mission.protocol.logoUrl} alt={mission.protocol.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      mission.protocol.name.charAt(0)
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#00E5FF', background: 'rgba(0,229,255,0.1)', padding: '0.2rem 0.6rem', letterSpacing: '0.1em' }}>{mission.category.toUpperCase()}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{mission.protocol.name}</span>
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem' }}>{mission.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', lineHeight: '1.5' }}>{mission.description.substring(0, 150)}...</p>
                </div>

                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>REWARD</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#00E5FF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={20} fill="#00E5FF" />
                      +{mission.reputationReward} XP
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                    <Clock size={14} />
                    {mission.difficulty}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
