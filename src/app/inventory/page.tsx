import { db } from '@/db'
import { users, userBadges } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Package, Award, Sparkles, Shield, Zap, Lock, ExternalLink, Box } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ConnectKitButton } from 'connectkit'

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ address?: string }> }) {
  const { address: queryAddress } = await searchParams
  const address = queryAddress?.toLowerCase()

  if (!address) {
    return (
      <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        <Box size={64} style={{ color: 'rgba(255,255,255,0.1)' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.1em' }}>VAULT LOCKED</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', textAlign: 'center' }}>
          Please visit your profile to unlock your inventory, or connect your wallet.
        </p>
        <Link href="/profile" className="btn-primary">GO TO PROFILE</Link>
      </div>
    )
  }

  const user = await db.query.users.findFirst({
    where: eq(users.address, address),
    with: {
      badges: {
        with: { badge: true }
      }
    }
  })

  const badges = user?.badges || []

  return (
    <div className="container" style={{ padding: '6rem 4vw' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          PERSONAL <span style={{ color: '#00E5FF' }}>INVENTORY</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, #00E5FF, transparent)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em' }}>
            SECURE VAULT • {address.substring(0, 10)}...
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {badges.map((ub: any, i: number) => (
          <div key={ub.id} style={{ 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(0, 229, 255, 0.1)',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
             <div style={{ 
               position: 'absolute', 
               top: '-20%', 
               right: '-20%', 
               width: '60%', 
               height: '60%', 
               background: `radial-gradient(circle, #00E5FF05 0%, transparent 70%)`,
               zIndex: 0
             }} />

             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: 'rgba(0, 229, 255, 0.05)', 
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00E5FF'
                }}>
                  <Award size={32} />
                </div>
                <span style={{ 
                  fontSize: '0.6rem', 
                  fontWeight: 900, 
                  letterSpacing: '0.2em', 
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(0, 229, 255, 0.1)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0, 229, 255, 0.2)'
                }}>
                  SOULBOUND
                </span>
             </div>

             <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'rgba(255,255,255,0.2)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Badge Achievement</div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', margin: 0 }}>{ub.badge.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: '1.5' }}>{ub.badge.description}</p>
             </div>

             <div style={{ 
               marginTop: 'auto', 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center',
               fontSize: '0.7rem',
               fontWeight: 900,
               color: 'rgba(255,255,255,0.1)',
               position: 'relative',
               zIndex: 1,
               paddingTop: '1.5rem',
               borderTop: '1px solid rgba(255,255,255,0.05)'
             }}>
                <span>#{ub.id.substring(0, 4).toUpperCase()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00E5FF', cursor: 'pointer' }}>
                  PROVENANCE <ExternalLink size={12} />
                </span>
             </div>
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: Math.max(0, 6 - badges.length) }).map((_, i) => (
          <div key={i} style={{ 
            background: 'rgba(255,255,255,0.01)', 
            border: '1px dashed rgba(255,255,255,0.05)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={24} style={{ opacity: 0.1 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
