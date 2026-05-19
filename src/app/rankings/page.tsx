import { db } from '@/db'
import { users } from '@/db/schema'
import { desc } from 'drizzle-orm'
import { Trophy, Medal, Star, Shield, Zap, Code, Sparkles, BookOpen, Globe } from 'lucide-react'
import Link from 'next/link'
import { ARCHETYPES_CONFIG, getLevelInfo } from '@/lib/archetypes'

export default async function RankingsPage() {
  const topUsers = await db.query.users.findMany({
    orderBy: [desc(users.reputation)],
    limit: 50,
  })

  return (
    <div className="container" style={{ padding: '6rem 4vw' }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '1rem' }}>
          THE <span style={{ color: '#00E5FF' }}>SANCTUM</span> RANKINGS
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          The highest-resonance contributors across the Arc Network. Your position is earned through verified on-chain work.
        </p>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '0'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '80px 1fr 120px 150px 150px',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize: '0.7rem',
          fontWeight: 900,
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.2em'
        }}>
          <div>RANK</div>
          <div>ARCHETYPE</div>
          <div>LEVEL</div>
          <div style={{ textAlign: 'right' }}>RESONANCE (XP)</div>
          <div style={{ textAlign: 'right' }}>PROFILE</div>
        </div>

        {topUsers.length === 0 && (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
            <Trophy size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
            <div style={{ fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em' }}>NO RESONANCE DETECTED YET</div>
          </div>
        )}

        {topUsers.map((user, index) => {
          const rank = index + 1
          const levelInfo = getLevelInfo(user.reputation)
          const config = (user.chosenArchetype && ARCHETYPES_CONFIG[user.chosenArchetype])
            ? ARCHETYPES_CONFIG[user.chosenArchetype]
            : ARCHETYPES_CONFIG.Developer

          return (
            <div key={user.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '80px 1fr 120px 150px 150px',
              padding: '1.5rem 2rem',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.03)',
              transition: 'background 0.2s ease',
              background: rank <= 3 ? `linear-gradient(90deg, ${config.color}05 0%, transparent 100%)` : 'transparent'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: rank <= 3 ? config.color : 'white' }}>
                #{rank}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: `${config.color}10`, 
                  border: `1px solid ${config.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: config.color
                }}>
                  <config.icon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{user.name || `${user.address.substring(0, 6)}...`}</div>
                  <div style={{ fontSize: '0.65rem', color: config.color, fontWeight: 900, letterSpacing: '0.1em' }}>{user.chosenArchetype?.toUpperCase() || 'INITIATE'}</div>
                </div>
              </div>
              <div style={{ fontWeight: 800 }}>
                LVL {levelInfo.level}
              </div>
              <div style={{ textAlign: 'right', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                {user.reputation.toLocaleString()}
              </div>
              <div style={{ textAlign: 'right' }}>
                <Link href={`/profile/${user.address}`} style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 900, 
                  color: 'white', 
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  letterSpacing: '0.1em'
                }}>
                  VIEW DATA
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
