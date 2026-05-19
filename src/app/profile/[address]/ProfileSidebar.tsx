'use client'

import { useState } from 'react'
import { User as UserIcon, Settings, Shield, Calendar, Camera, Hash, Zap, Star, Trophy, Sparkles } from 'lucide-react'
import { useAccount } from 'wagmi'
import { updateUserProfile, mintArchetypeSBT } from '@/actions/users'
import styles from './profile.module.css'
import { ARCHETYPES_CONFIG, getArchetypeStats, getPrimaryArchetype, getLevelInfo } from '@/lib/archetypes'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileSidebarProps {
  address: string
  user: any
}

export default function ProfileSidebar({ address, user }: ProfileSidebarProps) {
  const { address: currentAddress } = useAccount()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const isOwner = currentAddress?.toLowerCase() === address.toLowerCase()

  const stats = getArchetypeStats(user.submissions || [])
  const primaryClassName = getPrimaryArchetype(stats)
  
  // Use the user's chosen archetype if they have no XP yet
  const effectiveClass = (user.reputation > 0 && primaryClassName) 
    ? primaryClassName 
    : (user.chosenArchetype || 'Developer')

  const config = (effectiveClass && ARCHETYPES_CONFIG[effectiveClass])
    ? ARCHETYPES_CONFIG[effectiveClass]
    : ARCHETYPES_CONFIG.Developer
  const levelInfo = getLevelInfo(user.reputation || 0)

  const sbtProof = user.onChainProofs?.find((p: any) => p.entityType === 'USER' && p.proofType === 'SBT')
  const [claiming, setClaiming] = useState(false)

  const handleClaimIdentity = async () => {
    if (!address || !effectiveClass) return
    setClaiming(true)
    const res = await mintArchetypeSBT(address, effectiveClass, levelInfo.level)
    if (res.success) {
      window.location.reload()
    } else {
      alert(res.error || 'Failed to manifest identity on-chain')
    }
    setClaiming(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
    }

    const res = await updateUserProfile(address, data)
    
    if (res.success) {
      setIsEditing(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <div className={styles.profileCard} style={{ 
      position: 'relative', 
      overflow: 'hidden', 
      border: `1px solid ${config.color}20`,
      background: `linear-gradient(180deg, ${config.color}05 0%, rgba(2, 8, 24, 0.9) 100%)`
    }}>
      {/* Background Aura */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        left: '-10%', 
        width: '120%', 
        height: '40%', 
        background: `radial-gradient(circle, ${config.color}15 0%, transparent 70%)`,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className={styles.avatarLarge} style={{ 
          borderColor: config.color, 
          boxShadow: `0 0 30px ${config.color}20`,
          background: 'rgba(2, 8, 24, 1)'
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name || 'Profile'} className={styles.avatarImg} />
          ) : (
            <div style={{ color: config.color }}>
              <config.icon size={48} />
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
             <Star size={14} color="#FFD700" fill="#FFD700" />
             <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>RESONANCE RANK</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            {user.name || `${address.substring(0, 6)}...${address.substring(address.length - 4)}`}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: config.color, fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em', background: `${config.color}15`, padding: '0.25rem 0.75rem', borderRadius: '2px' }}>
                <config.icon size={14} />
                {config.name.toUpperCase()}
             </div>
             <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 900 }}>|</span>
             <span style={{ color: 'white', fontWeight: 900, fontSize: '0.8rem' }}>LEVEL {levelInfo.level}</span>
          </div>
        </div>

        <div className={styles.bioBox}>
          <p style={{ 
            fontSize: '0.95rem', 
            color: 'rgba(255,255,255,0.6)', 
            lineHeight: '1.7', 
            fontStyle: 'italic',
            marginBottom: '2rem',
            padding: '0 1rem'
          }}>
            "{user.bio || `Embodying the essence of the ${config.name} in the Arc Network.`}"
          </p>
        </div>

        {/* Action Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {isOwner && (
            <button onClick={() => setIsEditing(true)} className={styles.editTriggerBtn} style={{ margin: 0, width: '100%', borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <Settings size={14} />
              MODIFY LEGEND
            </button>
          )}

          {isOwner && !sbtProof && (
            <button 
              onClick={handleClaimIdentity} 
              className={styles.claimIdentityBtn} 
              disabled={claiming}
              style={{
                width: '100%',
                padding: '1.25rem',
                background: `linear-gradient(45deg, ${config.color}, #a855f7)`,
                color: 'white',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 900,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: `0 10px 30px ${config.color}30`
              }}
            >
              {claiming ? 'MANIFESTING...' : (
                <>
                  <Hash size={16} />
                  MANIFEST ON-CHAIN IDENTITY
                </>
              )}
            </button>
          )}
        </div>

        {sbtProof && (
          <div style={{ 
            marginBottom: '2rem', 
            padding: '1.25rem', 
            background: 'rgba(0, 229, 255, 0.03)', 
            border: `1px solid ${config.color}30`,
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: config.color, fontSize: '0.7rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              <Shield size={14} />
              VERIFIED ON-CHAIN PROOF
            </div>
            <a 
              href={`https://testnet.arcscan.app/tx/${sbtProof.transactionHash}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', textDecoration: 'none', wordBreak: 'break-all', fontFamily: 'monospace' }}
            >
              TX: {sbtProof.transactionHash}
            </a>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 900, marginBottom: '0.5rem' }}>TOTAL XP</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: config.color }}>{user.reputation}</div>
           </div>
           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', fontWeight: 900, marginBottom: '0.5rem' }}>TRUST LEVEL</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{user.contributorProfile?.trustLevel || 1}</div>
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            <Calendar size={14} />
            <span>Active since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            <Trophy size={14} />
            <span>{user.submissions.length} Missions Completed</span>
          </div>
        </div>
      </div>

      {/* Edit Modal / Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: '#020818', 
              zIndex: 10,
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2rem' }}>MODIFY IDENTITY</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, marginBottom: '0.5rem', display: 'block' }}>ALIAS</label>
                <input name="name" defaultValue={user.name} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'white' }} />
              </div>
              <div className="input-group">
                <label style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900, marginBottom: '0.5rem', display: 'block' }}>BIO</label>
                <textarea name="bio" defaultValue={user.bio} rows={4} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'white', fontSize: '0.9rem' }} />
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontWeight: 900 }}>CANCEL</button>
                <button type="submit" className="btn-primary" style={{ flex: 1.5, padding: '1rem', fontWeight: 900 }}>SAVE CHANGES</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
