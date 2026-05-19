'use client'

import { useState, useEffect } from 'react'
import { Plus, Globe, X, Shield, Trash2, Loader2, CheckCircle, XCircle, Rocket, Zap, Crown } from 'lucide-react'
import { createProtocol, getProtocols, deleteProtocol, getProtocolApplications, approveProtocolApplication } from '@/actions/protocols'
import { motion, AnimatePresence } from 'framer-motion'

export default function ProtocolsAdminPage() {
  const [protocols, setProtocols] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'realms' | 'applications'>('realms')
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    twitter: '',
    logoUrl: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [pData, aData] = await Promise.all([
      getProtocols(),
      getProtocolApplications()
    ])
    setProtocols(pData)
    setApplications(aData.filter(a => a.status === 'PENDING'))
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    const res = await approveProtocolApplication(id)
    if (res.success) loadData()
    else alert(res.error)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Exile this protocol from the network?')) return
    const res = await deleteProtocol(id)
    if (res.success) loadData()
  }

  return (
    <div className="container" style={{ paddingTop: '6rem', minHeight: '100vh' }}>
      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#00E5FF', marginBottom: '1rem' }}>
            <Crown size={24} />
            <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Command Sanctum</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '0.05em', margin: 0 }}>REALM OVERSEER</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('realms')}
            style={{
              background: activeTab === 'realms' ? 'white' : 'transparent',
              color: activeTab === 'realms' ? 'black' : 'rgba(255,255,255,0.4)',
              border: activeTab === 'realms' ? 'none' : '1px solid rgba(255,255,255,0.1)',
              padding: '0.75rem 2rem',
              fontWeight: 900,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ACTIVE REALMS ({protocols.length})
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            style={{
              background: activeTab === 'applications' ? 'white' : 'transparent',
              color: activeTab === 'applications' ? 'black' : 'rgba(255,255,255,0.4)',
              border: activeTab === 'applications' ? 'none' : '1px solid rgba(255,255,255,0.1)',
              padding: '0.75rem 2rem',
              fontWeight: 900,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            PENDING RITUALS ({applications.length})
            {applications.length > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#00E5FF', width: '10px', height: '10px', borderRadius: '50%' }} />
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
          <Loader2 className="animate-spin" size={48} color="#00E5FF" />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%' }}
        >
          {activeTab === 'realms' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
              {protocols.map(p => (
                <motion.div 
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  className="glass-panel" 
                  style={{ 
                    padding: '2rem', 
                    position: 'relative', 
                    border: '1px solid rgba(0, 229, 255, 0.1)',
                    background: 'rgba(255,255,255,0.01)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ width: '50px', height: '50px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#00E5FF' }}>
                      {p.name.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,0,0,0.3)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </div>
                  </div>
                  
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>{p.name.toUpperCase()}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6', marginBottom: '2rem', height: '3.2rem', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.2)' }}>
                      {p.website && <Globe size={16} />}
                      {p.twitter && <X size={16} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 900 }}>
                      <Shield size={14} />
                      VERIFIED REALM
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {applications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '8rem', color: 'rgba(255,255,255,0.1)', fontSize: '1.2rem', fontWeight: 900 }}>
                  NO PENDING APPLICATIONS FOUND
                </div>
              ) : (
                applications.map(app => (
                  <motion.div 
                    key={app.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="glass-panel" 
                    style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem', borderLeft: '4px solid #00E5FF' }}
                  >
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>NEW APPLICATION</div>
                      <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>{app.name}</h3>
                      <p style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>{app.description}</p>
                      
                      <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginBottom: '0.25rem' }}>WEBSITE</div>
                          <a href={app.website} target="_blank" style={{ color: '#00E5FF', fontSize: '0.8rem', textDecoration: 'none' }}>{app.website}</a>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginBottom: '0.25rem' }}>TWITTER</div>
                          <span style={{ color: 'white', fontSize: '0.8rem' }}>{app.twitter}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '4rem' }}>
                      <button 
                        onClick={() => handleApprove(app.id)}
                        className="btn-primary" 
                        style={{ width: '100%', padding: '1.25rem', background: '#00E5FF', color: 'black', fontWeight: 900, border: 'none', cursor: 'pointer' }}
                      >
                        APPROVE REALM
                      </button>
                      <button 
                        style={{ width: '100%', padding: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontWeight: 900, cursor: 'pointer' }}
                      >
                        REJECT
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
