'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ArrowLeft, CheckCircle, Clock, ShieldAlert } from 'lucide-react'
import { getProtocolForAdmin } from '@/actions/users'
import { getProtocolDashboardData } from '@/actions/protocols'

export default function ProtocolReviewsPage() {
  const { address, isConnected } = useAccount()
  const [loading, setLoading] = useState(true)
  const [protocol, setProtocol] = useState<any>(null)
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      if (!isConnected || !address) {
        setLoading(false)
        return
      }

      const proto = await getProtocolForAdmin(address)
      if (proto) {
        setProtocol(proto)
        const dashData = await getProtocolDashboardData(proto.id)
        if (dashData.success && dashData.missions) {
          // Extract pending submissions
          const pending = dashData.missions.flatMap((m: any) => 
            m.submissions
              .filter((s: any) => s.status === 'PENDING')
              .map((s: any) => ({ ...s, mission: m }))
          ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          
          setPendingSubmissions(pending)
        }
      }
      setLoading(false)
    }

    loadData()
  }, [isConnected, address])

  if (loading) return <div className="container" style={{ padding: '4rem' }}><p>Initializing terminal...</p></div>

  if (!protocol) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <ShieldAlert size={48} style={{ margin: '0 auto 1rem', color: 'rgba(255,255,255,0.2)' }} />
        <h2>Access Denied</h2>
        <p>You must be a Protocol Admin to view this page.</p>
        <Link href="/dashboard/protocol" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link href="/dashboard/protocol" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.8rem', fontWeight: 900 }}>
        <ArrowLeft size={16} /> BACK TO PROTOCOL DASHBOARD
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.1em' }}>PENDING REVIEWS</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Verify evidence submitted by contributors for {protocol.name} missions.</p>
      </div>

      {pendingSubmissions.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'rgba(0, 229, 255, 0.5)' }} />
          <h3>All caught up!</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>There are no pending submissions awaiting review.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingSubmissions.map(sub => (
            <Link href={`/dashboard/protocol/reviews/${sub.id}`} key={sub.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: 'inherit', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#00E5FF', background: 'rgba(0,229,255,0.1)', padding: '0.2rem 0.6rem', letterSpacing: '0.1em' }}>NEEDS REVIEW</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {new Date(sub.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.25rem' }}>{sub.title || 'Untitled Submission'}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Mission: {sub.mission.title}</p>
              </div>
              <div style={{ color: '#00E5FF', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em' }}>
                REVIEW EVIDENCE ➔
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
