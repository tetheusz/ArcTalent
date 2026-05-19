'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Send, CheckCircle, Sparkles, Rocket, Globe, X, Command } from 'lucide-react'
import { useAccount } from 'wagmi'
import { applyProtocol } from '@/actions/protocols'
import { motion } from 'framer-motion'

export default function ProtocolApplyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { address, isConnected } = useAccount()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isConnected || !address) {
      alert('You must connect your essence (wallet) to the network first.')
      return
    }

    setStatus('loading')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      userId: address,
      name: formData.get('name') as string,
      website: formData.get('website') as string,
      twitter: formData.get('twitter') as string,
      description: formData.get('description') as string,
    }

    const result = await applyProtocol(data)
    
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      alert(result.error || 'The ritual was interrupted. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel" 
          style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px' }}
        >
          <div style={{ background: 'rgba(0, 229, 255, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle size={48} color="#00E5FF" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '0.05em' }}>RITUAL INITIATED</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', marginBottom: '3rem' }}>
            Your protocol application has been broadcasted to the Realm Overseers. 
            The Sanctum will review your presence and notify you once your realm is activated.
          </p>
          <button className="btn-primary" onClick={() => router.push('/')} style={{ width: '100%' }}>
            RETURN TO ARCHETYPES
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '6rem', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00E5FF', marginBottom: '1.5rem' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em' }}>ONBOARDING RITUAL</span>
          </div>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '1.5rem', lineHeight: '1.1' }}>ACTIVATE YOUR REALM</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4rem', maxWidth: '600px', lineHeight: '1.6' }}>
            Become a partner protocol and empower thousands of contributors with verified on-chain archetypes.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>PROTOCOL NAME</label>
                <input name="name" type="text" placeholder="e.g. Arc House" required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', color: 'white', fontSize: '1rem' }} />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>WEBSITE</label>
                <input name="website" type="url" placeholder="https://..." required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', color: 'white', fontSize: '1rem' }} />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>TWITTER / X HANDLE</label>
              <input name="twitter" type="text" placeholder="@..." style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', color: 'white', fontSize: '1rem' }} />
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem', letterSpacing: '0.1em' }}>PROTOCOL VISION (DESCRIPTION)</label>
              <textarea name="description" placeholder="Briefly describe what your protocol does..." rows={5} required style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem', color: 'white', fontSize: '1rem', lineHeight: '1.6' }} />
            </div>

            <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ height: '4.5rem', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {status === 'loading' ? 'SUMMONING...' : 'INITIATE ONBOARDING'}
              <Rocket size={24} />
            </button>
          </form>
        </div>

        <div style={{ position: 'sticky', top: '8rem' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', background: 'rgba(0, 229, 255, 0.02)', border: '1px solid rgba(0, 229, 255, 0.1)' }}>
            <Command size={32} color="#00E5FF" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>PROTOCOL SANCTUM</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Every realm added to Archetypes undergoes a rigorous review ritual to ensure the highest quality missions for our contributors.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <Shield size={16} />, text: 'Verified Social Presence' },
                { icon: <Globe size={16} />, text: 'Active Testnet Protocols' },
                { icon: <Sparkles size={16} />, text: 'Curated Mission Quality' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                  <div style={{ color: '#00E5FF' }}>{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
