'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ExternalLink, Award, User, Clock, Loader2 } from 'lucide-react'
import { db } from '@/db'
import { reviewSubmission } from '@/actions/missions'
import { useAccount } from 'wagmi'

export default function ReviewDashboard() {
  const { address } = useAccount()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState<string | null>(null)
  const [reviewData, setReviewData] = useState({
    feedback: '',
    qualityScore: 5,
    impactScore: 5,
    rewardGranted: 0
  })

  useEffect(() => {
    fetchPending()
  }, [])

  const fetchPending = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/submissions/pending')
    const data = await res.json()
    setSubmissions(data)
    setLoading(false)
  }

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (!address) return
    const res = await reviewSubmission(id, address.toLowerCase(), {
      ...reviewData,
      status
    })
    if (res.success) {
      setReviewing(null)
      setReviewData({ feedback: '', qualityScore: 5, impactScore: 5, rewardGranted: 0 })
      fetchPending()
    } else {
      alert(res.error)
    }
  }

  if (loading) return <div className="container" style={{ paddingTop: '10rem', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.1em' }}>SUBMISSION REVIEWS</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Evaluate contributions and award reputation to worthy archetypes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {submissions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>
            No pending submissions for review.
          </div>
        ) : (
          submissions.map(sub => (
            <div key={sub.id} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(0,229,255,0.1)', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 900 }}>
                      {sub.mission.category.toUpperCase()}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{sub.mission.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>Submited by: <span style={{ color: 'white' }}>{sub.user.address}</span></p>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem', textTransform: 'uppercase' }}>Evidence</h4>
                    <p style={{ lineHeight: '1.6' }}>{sub.evidence}</p>
                    {sub.links && (
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                         <a href="#" className="btn-secondary" style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}>
                           VIEW ARTIFACT <ExternalLink size={12} />
                         </a>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '2rem' }}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>FEEDBACK</label>
                    <textarea 
                      value={reviewData.feedback}
                      onChange={e => setReviewData({...reviewData, feedback: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'white', fontSize: '0.85rem' }}
                      rows={4}
                      placeholder="Excellent work on the protocol logic..."
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.5rem' }}>REWARD (XP)</label>
                    <input 
                      type="number"
                      value={reviewData.rewardGranted}
                      onChange={e => setReviewData({...reviewData, rewardGranted: parseInt(e.target.value)})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'white', fontSize: '1.2rem', fontWeight: 900 }}
                    />
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>Max: {sub.mission.reputationReward} XP</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => handleReview(sub.id, 'REJECTED')}
                      className="btn-secondary" 
                      style={{ flex: 1, borderColor: 'rgba(255,0,0,0.2)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      REJECT
                    </button>
                    <button 
                      onClick={() => handleReview(sub.id, 'APPROVED')}
                      className="btn-primary" 
                      style={{ flex: 2, background: '#00E5FF', color: 'black' }}
                    >
                      APPROVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
