'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Plus, Target, Rocket, Shield, BookOpen, PenTool, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createMission } from '@/actions/missions'
import { getProtocolForAdmin } from '@/actions/users'
import { ARCHETYPES_CONFIG } from '@/lib/archetypes'

export default function CreateMissionPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const [protocol, setProtocol] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    category: 'Developer',
    difficulty: 'BEGINNER',
    reputationReward: 10,
    protocolId: '',
  })

  useEffect(() => {
    async function init() {
      if (!isConnected || !address) {
        setPageLoading(false)
        return
      }
      const proto = await getProtocolForAdmin(address)
      if (proto) {
        setProtocol(proto)
        setFormData(prev => ({ ...prev, protocolId: proto.id }))
      }
      setPageLoading(false)
    }
    init()
  }, [isConnected, address])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.protocolId) return alert('Protocol not configured')
    setLoading(true)
    const res = await createMission(formData)
    if (res.success) {
      router.push('/dashboard/protocol')
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  if (pageLoading) return <div className="container" style={{ padding: '4rem' }}><p>Initializing mission terminal...</p></div>

  if (!protocol) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You must be a Protocol Admin to create missions.</p>
        <Link href="/dashboard/protocol" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
      <Link href="/dashboard/protocol" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 900 }}>
        <ArrowLeft size={16} /> BACK TO PROTOCOL DASHBOARD
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.1em' }}>CREATE MISSION</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Define a new objective for {protocol.name} contributors.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>TITLE</label>
            <input 
              required 
              placeholder="e.g. Optimize Smart Contract Security"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', fontSize: '1.1rem', borderRadius: '4px' }}
            />
          </div>

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>ARCHETYPE CATEGORY</label>
            <select 
              required 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', borderRadius: '4px' }}
            >
              {Object.values(ARCHETYPES_CONFIG).map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
            </select>
          </div>

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>DESCRIPTION</label>
            <textarea 
              required 
              rows={4}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>REQUIREMENTS (EVIDENCE)</label>
            <textarea 
              required 
              rows={3}
              placeholder="List specific evidence required (e.g. GitHub PR link, Tweet URL)..."
              value={formData.requirements} 
              onChange={e => setFormData({...formData, requirements: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>DIFFICULTY</label>
              <select 
                value={formData.difficulty} 
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', borderRadius: '4px' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>REPUTATION REWARD (XP)</label>
              <input 
                type="number"
                required 
                value={formData.reputationReward} 
                onChange={e => setFormData({...formData, reputationReward: parseInt(e.target.value)})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', fontSize: '1.2rem', fontWeight: 900, borderRadius: '4px' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', height: '3.5rem', fontSize: '1.1rem' }}>
            {loading ? 'INITIALIZING MISSION...' : 'PUBLISH MISSION'}
          </button>
        </form>
      </div>
    </div>
  )
}
