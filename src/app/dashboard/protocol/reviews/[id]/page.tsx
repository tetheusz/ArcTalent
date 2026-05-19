'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ArrowLeft, Check, X, ShieldAlert, FileText, ExternalLink } from 'lucide-react'
import { getSubmissionById, approveSubmission, rejectSubmission } from '@/actions/reviews'
import { getProtocolForAdmin } from '@/actions/users'

export default function ProtocolSubmissionReviewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submission, setSubmission] = useState<any>(null)
  const [protocol, setProtocol] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      const proto = await getProtocolForAdmin(address)
      if (proto) {
        setProtocol(proto)
        const subData = await getSubmissionById(id as string)
        if (subData && subData.mission.protocolId === proto.id) {
          setSubmission(subData)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [isConnected, address, id])

  const handleApprove = async () => {
    if (!address) return
    const feedback = prompt('Add an optional encouraging comment for the contributor:') || 'Great work!'
    setSubmitting(true)
    const res = await approveSubmission(submission.id, address, feedback)
    if (res.success) {
      router.push('/dashboard/protocol/reviews')
    } else {
      alert(res.error)
      setSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!address) return
    const feedback = prompt('Please provide feedback explaining why this was rejected:')
    if (!feedback) return // User cancelled
    
    setSubmitting(true)
    const res = await rejectSubmission(submission.id, address, feedback)
    if (res.success) {
      router.push('/dashboard/protocol/reviews')
    } else {
      alert(res.error)
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container" style={{ padding: '4rem' }}><p>Accessing terminal...</p></div>

  if (!protocol || !submission) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.2)' }} />
        <h2>Not Found or Access Denied</h2>
        <p>This submission may not exist or doesn't belong to your protocol.</p>
        <Link href="/dashboard/protocol/reviews" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Back to Queue
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
      <Link href="/dashboard/protocol/reviews" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 900 }}>
        <ArrowLeft size={16} /> BACK TO PENDING REVIEWS
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#00E5FF', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
          SUBMISSION UNDER REVIEW
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{submission.title || 'Untitled Submission'}</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Submitted by: {submission.user?.name || submission.user?.address}</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          MISSION CONTEXT
        </h3>
        <p style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.5rem' }}>{submission.mission.title}</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>{submission.mission.requirements}</p>

        <h3 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
          PROVIDED EVIDENCE
        </h3>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '4px', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
          {submission.evidence}
        </div>

        {submission.links && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>ATTACHED LINKS</span>
            {submission.links.split(',').map((link: string, i: number) => (
              <a key={i} href={link.trim()} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00E5FF', textDecoration: 'none' }}>
                <ExternalLink size={14} />
                {link.trim()}
              </a>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={handleApprove} 
          disabled={submitting} 
          style={{ flex: 1, padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          {submitting ? 'PROCESSING...' : <><Check size={20} /> APPROVE & AWARD {submission.mission.reputationReward} XP</>}
        </button>
        <button 
          className="btn-secondary" 
          onClick={handleReject} 
          disabled={submitting}
          style={{ padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          <X size={20} /> REJECT
        </button>
      </div>
    </div>
  )
}
