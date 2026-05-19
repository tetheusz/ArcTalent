'use client'

import { useState } from 'react'
import { ARCHETYPES_CONFIG } from '@/lib/archetypes'
import { updateChosenArchetype, updateUserProfile } from '@/actions/users'
import { useAccount } from 'wagmi'
import { ArrowRight, Sparkles, Wand2, User, Type, Info, CheckCircle2, Rocket } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MAGICAL_TITLES: Record<string, string> = {
  Developer: 'THE ALCHEMIST',
  Sentinel: 'THE GUARDIAN',
  Creator: 'THE WEAVER',
  Scholar: 'THE ORACLE',
  Architect: 'THE ARCHMAGE'
}

const MAGICAL_DESC: Record<string, string> = {
  Developer: 'Architect of digital infrastructure. Specializes in smart contracts, frontend engineering, and protocol development.',
  Sentinel: 'Protector of network integrity. Focuses on security audits, QA testing, bug hunting, and system stability.',
  Creator: 'Manifesting the ecosystem narrative. Dedicated to content creation, social media, and visual arts.',
  Scholar: 'Keeper of decentralized knowledge. Engaged in deep research, data analysis, and technical writing.',
  Architect: 'Orchestrator of collective growth. Leads protocol development, governance, and ecosystem coordination.'
}

type Step = 'SELECTION' | 'PERSONALIZATION' | 'CONFIRMATION'

export default function ArchetypeOnboarding({ onComplete }: { onComplete: () => void }) {
  const { address } = useAccount()
  const [step, setStep] = useState<Step>('SELECTION')
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    bio: ''
  })

  const handleArchetypeSubmit = async () => {
    if (!selected) return
    setStep('PERSONALIZATION')
  }

  const handleFinalSubmit = async () => {
    if (!selected || !address) return
    setLoading(true)
    
    // Step 1: Update Archetype
    const archRes = await updateChosenArchetype(address, selected)
    
    // Step 2: Update Profile
    if (archRes.success) {
      const profRes = await updateUserProfile(address, profileData)
      if (profRes.success) {
        setStep('CONFIRMATION')
        setTimeout(onComplete, 3000)
      } else {
        alert(profRes.error || 'Personalization failed. Try again.')
      }
    } else {
      alert('Archetype selection failed. Try again.')
    }
    setLoading(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, #0a0e1a 0%, #020818 100%)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden'
      }}
    >
      {/* Floating background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              background: '#00E5FF',
              borderRadius: '50%',
              boxShadow: '0 0 10px #00E5FF',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'SELECTION' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <motion.div 
              style={{ marginBottom: '4rem', maxWidth: '800px', zIndex: 1 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#00E5FF', marginBottom: '1rem' }}>
                <Wand2 size={24} />
                <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Awaken Your Essence</span>
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '0.15em', marginBottom: '1rem', color: 'white' }}>
                CHOOSE YOUR ORIGIN
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>
                Select the archetype that aligns with your resonance.
              </p>
            </motion.div>

            <div style={{
              display: 'flex',
              gap: '2rem',
              width: '100%',
              maxWidth: '1400px',
              justifyContent: 'center',
              marginBottom: '5rem',
              zIndex: 1
            }}>
              {Object.entries(ARCHETYPES_CONFIG).map(([key, config], index) => {
                const isSelected = selected === config.name
                return (
                  <motion.div 
                    key={key}
                    whileHover={{ scale: 1.02, y: -10 }}
                    onClick={() => setSelected(config.name)}
                    style={{
                      width: '220px',
                      height: '350px',
                      background: isSelected ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                      border: `1px solid ${isSelected ? config.color : 'rgba(255,255,255,0.06)'}`,
                      padding: '2.5rem 1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      position: 'relative',
                      boxShadow: isSelected ? `0 20px 60px ${config.glow}` : 'none'
                    }}
                  >
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: `${config.color}10`, 
                      border: `1px solid ${config.color}30`,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '2rem',
                      color: config.color
                    }}>
                      <config.icon size={32} />
                    </div>
                    <div style={{ color: config.color, fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
                      {MAGICAL_TITLES[key]}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>{config.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>"{MAGICAL_DESC[key].substring(0, 80)}..."</p>
                  </motion.div>
                )
              })}
            </div>

            <motion.button 
              onClick={handleArchetypeSubmit}
              disabled={!selected}
              className="btn-primary"
              style={{ padding: '1.25rem 4rem', fontSize: '1rem', fontWeight: 900 }}
            >
              CONTINUE RITUAL <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {step === 'PERSONALIZATION' && (
          <motion.div 
            key="personalization"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '600px', zIndex: 1 }}
          >
            <div style={{ color: '#00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <User size={24} />
              <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em' }}>IDENTITY PERSONALIZATION</span>
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>NAME YOUR LEGEND</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4rem' }}>Every hero needs a name that echoes through the decentralized void.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', textAlign: 'left' }}>
              <div className="input-group">
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '1rem', display: 'block' }}>USER ALIAS</label>
                <div style={{ position: 'relative' }}>
                  <Type size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
                  <input 
                    type="text" 
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="e.g. Satoshi_Nakamoto" 
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.25rem 1.25rem 3.5rem', color: 'white', fontSize: '1rem' }} 
                  />
                </div>
              </div>

              <div className="input-group">
                <label style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 900, marginBottom: '1rem', display: 'block' }}>RESONANCE BIO</label>
                <div style={{ position: 'relative' }}>
                  <Info size={18} style={{ position: 'absolute', left: '1.25rem', top: '1.25rem', color: 'rgba(255,255,255,0.2)' }} />
                  <textarea 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Tell us about your mission..." 
                    rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.25rem 1.25rem 3.5rem', color: 'white', fontSize: '1rem', lineHeight: '1.6' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStep('SELECTION')} style={{ flex: 1, padding: '1.25rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontWeight: 900 }}>GO BACK</button>
                <button 
                  onClick={handleFinalSubmit}
                  disabled={!profileData.name || loading}
                  className="btn-primary" 
                  style={{ flex: 2, padding: '1.25rem', fontWeight: 900 }}
                >
                  {loading ? 'CHANNELING...' : 'MANIFEST IDENTITY'} <Sparkles size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'CONFIRMATION' && (
          <motion.div 
            key="confirmation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', zIndex: 1 }}
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px dashed #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem' }}
            >
              <Rocket size={48} color="#00E5FF" />
            </motion.div>
            <h1 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '0.1em' }}>AWAKENED</h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>
              <CheckCircle2 size={24} color="#00E5FF" />
              Your identity has been anchored in the network.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Border Accents */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', width: '40px', height: '40px', borderTop: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', width: '40px', height: '40px', borderTop: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', width: '40px', height: '40px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderLeft: '2px solid rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', width: '40px', height: '40px', borderBottom: '2px solid rgba(255,255,255,0.1)', borderRight: '2px solid rgba(255,255,255,0.1)' }} />
    </motion.div>
  )
}
