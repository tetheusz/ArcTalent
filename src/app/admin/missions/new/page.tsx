'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Target, Rocket, Shield, BookOpen, PenTool, Users } from 'lucide-react'
import { createMission } from '@/actions/missions'
import { getProtocols } from '@/actions/protocols'
import { ARCHETYPES_CONFIG } from '@/lib/archetypes'

export default function NewMissionPage() {
  const router = useRouter()
  const [protocols, setProtocols] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
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
    getProtocols().then(setProtocols)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.protocolId) return alert('Select a protocol')
    setLoading(true)
    const res = await createMission(formData)
    if (res.success) {
      router.push('/missions')
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.1em' }}>CREATE MISSION</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Define a new objective and align it with an archetype.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="input-group">
            <label>Title</label>
            <input 
              required 
              placeholder="e.g. Optimize Smart Contract Security"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', fontSize: '1.1rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label>Partner Protocol</label>
              <select 
                required 
                value={formData.protocolId} 
                onChange={e => setFormData({...formData, protocolId: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white' }}
              >
                <option value="">Select Protocol</option>
                {protocols.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Archetype Category</label>
              <select 
                required 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white' }}
              >
                {Object.values(ARCHETYPES_CONFIG).map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea 
              required 
              rows={4}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white' }}
            />
          </div>

          <div className="input-group">
            <label>Requirements</label>
            <textarea 
              required 
              rows={3}
              placeholder="List specific evidence required..."
              value={formData.requirements} 
              onChange={e => setFormData({...formData, requirements: e.target.value})}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="input-group">
              <label>Difficulty</label>
              <select 
                value={formData.difficulty} 
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
            <div className="input-group">
              <label>Reputation Reward (XP)</label>
              <input 
                type="number"
                required 
                value={formData.reputationReward} 
                onChange={e => setFormData({...formData, reputationReward: parseInt(e.target.value)})}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', color: 'white', fontSize: '1.2rem', fontWeight: 900 }}
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
