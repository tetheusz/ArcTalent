'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, CheckSquare, Flag, Shield, Check, X, Users, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { approveProtocol, rejectProtocol, deleteProtocol } from '@/actions/protocols'
import { approveMission, deleteMission } from '@/actions/missions'
import { useAccount } from 'wagmi'
import { getUserRole } from '@/actions/users'
import styles from './admin.module.css'

import { approveSubmission, rejectSubmission } from '@/actions/reviews'

interface AdminTabsProps {
  pendingProtocols: any[]
  allProtocols: any[]
  allMissions: any[]
  pendingSubmissions: any[]
  allUsers: any[]
}

export default function AdminTabs({ pendingProtocols, allProtocols, allMissions, pendingSubmissions, allUsers }: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'protocols' | 'missions' | 'submissions' | 'users' | 'moderation'>('protocols')
  const [loading, setLoading] = useState<string | null>(null)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      getUserRole(address).then(data => setIsAuthorized(data.role === 'ADMIN'))
    } else if (isConnected === false) {
      setIsAuthorized(false)
    }
  }, [isConnected, address])

  if (isAuthorized === false) {
    return (
      <div className={styles.emptyTable}>
        <Shield size={48} className={styles.emptyIcon} />
        <h3>Acesso Negado</h3>
        <p>Você não tem permissão para acessar esta área.</p>
        <p className={styles.helpText}>
          Para testar como Admin, você precisa promover seu endereço no banco de dados.
          Conecte sua carteira: <strong>{address}</strong>
        </p>
      </div>
    )
  }

  if (isAuthorized === null) return <div>Checking permissions...</div>

  const handleApproveProtocol = async (id: string) => {
    setLoading(id)
    await approveProtocol(id)
    setLoading(null)
  }

  const handleRejectProtocol = async (id: string) => {
    setLoading(id)
    await rejectProtocol(id)
    setLoading(null)
  }

  const handleApproveMission = async (id: string) => {
    setLoading(id)
    await approveMission(id)
    setLoading(null)
  }

  const handleDeleteProtocol = async (id: string) => {
    if (!confirm('Are you sure you want to delete this protocol? This cannot be undone.')) return
    setLoading(id)
    await deleteProtocol(id)
    setLoading(null)
  }

  const handleDeleteMission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mission? This cannot be undone.')) return
    setLoading(id)
    await deleteMission(id)
    setLoading(null)
  }

  const handleApproveSubmission = async (id: string) => {
    setLoading(id)
    if (address) {
      await approveSubmission(id, address, 'Great work!')
    }
    setLoading(null)
  }

  const handleRejectSubmission = async (id: string) => {
    if (!address) return alert('Connect wallet')
    const feedback = prompt('Please provide feedback for rejection:')
    if (!feedback) return
    
    setLoading(id)
    await rejectSubmission(id, address, feedback)
    setLoading(null)
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'protocols' ? styles.active : ''}`}
            onClick={() => setActiveTab('protocols')}
          >
            <LayoutGrid size={20} />
            <span>Protocols</span>
            {pendingProtocols.length > 0 && <span className={styles.countBadgeSmall}>{pendingProtocols.length}</span>}
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'missions' ? styles.active : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            <CheckSquare size={20} />
            <span>Missions</span>
            {allMissions.filter(m => m.status === 'PENDING_APPROVAL').length > 0 && (
              <span className={styles.countBadgeSmall}>
                {allMissions.filter(m => m.status === 'PENDING_APPROVAL').length}
              </span>
            )}
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'submissions' ? styles.active : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <Shield size={20} />
            <span>Submissions</span>
            {pendingSubmissions.length > 0 && <span className={styles.countBadgeSmall}>{pendingSubmissions.length}</span>}
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'moderation' ? styles.active : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <Flag size={20} />
            <span>Moderation</span>
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
        {activeTab === 'protocols' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Protocol Management</h2>
              <span className={styles.countBadge}>{allProtocols.length} Verified</span>
            </div>

            {allProtocols.length > 0 && (
              <div className={styles.table} style={{ marginBottom: '3rem' }}>
                {allProtocols.map(proto => (
                  <div key={proto.id} className={`${styles.item} glass-panel`}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, borderRadius: '8px', overflow: 'hidden' }}>
                        {proto.logoUrl ? (
                          <img src={proto.logoUrl} alt={proto.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          proto.name.charAt(0)
                        )}
                      </div>
                      <div className={styles.itemInfo}>
                        <h3>{proto.name}</h3>
                        <p>{proto.website}</p>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <Link href={`/admin/protocols/${proto.id}/edit`} className={styles.editBtn}>
                        Edit Profile
                      </Link>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDeleteProtocol(proto.id)}
                        disabled={loading === proto.id}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.tabHeader}>
              <h2>Verification Queue</h2>
              <span className={styles.countBadge}>{pendingProtocols.length} Pending</span>
            </div>
            
            {pendingProtocols.length === 0 ? (
              <div className={styles.emptyTable}>
                <Shield size={48} className={styles.emptyIcon} />
                <h3>No pending applications</h3>
                <p>New protocol applications will appear here for review.</p>
              </div>
            ) : (
              <div className={styles.table}>
                {pendingProtocols.map(app => (
                  <div key={app.id} className={`${styles.item} glass-panel`}>
                    <div className={styles.itemInfo}>
                      <h3>{app.name}</h3>
                      <p>{app.description}</p>
                      <a href={app.website} target="_blank" className={styles.link}>{app.website}</a>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => handleApproveProtocol(app.id)}
                        disabled={loading === app.id}
                      >
                        <Check size={18} />
                        Approve
                      </button>
                      <button 
                        className={styles.rejectBtn}
                        onClick={() => handleRejectProtocol(app.id)}
                        disabled={loading === app.id}
                      >
                        <X size={18} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'missions' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Mission Management</h2>
              <span className={styles.countBadge}>{allMissions.length} Total</span>
            </div>
            
            {allMissions.length === 0 ? (
              <div className={styles.emptyTable}>
                <CheckSquare size={48} className={styles.emptyIcon} />
                <h3>No missions found</h3>
              </div>
            ) : (
              <div className={styles.table}>
                {allMissions.map(mission => (
                  <div key={mission.id} className={`${styles.item} glass-panel`}>
                    <div className={styles.itemInfo}>
                      <div className={styles.statusRow}>
                        {mission.status === 'PENDING_APPROVAL' ? (
                          <span className={`${styles.statusBadge} ${styles.pending}`}>Waiting Approval</span>
                        ) : (
                          <span className={`${styles.statusBadge} ${styles.approved}`}>Published</span>
                        )}
                        <span className={styles.protocolName}>• {mission.protocol?.name}</span>
                      </div>
                      <h3>{mission.title}</h3>
                      <span className="badge">{mission.category}</span>
                    </div>
                    <div className={styles.itemActions}>
                      {mission.status === 'PENDING_APPROVAL' && (
                        <button 
                          className={styles.approveBtn} 
                          onClick={() => handleApproveMission(mission.id)}
                          disabled={loading === mission.id}
                        >
                          <Check size={18} />
                          Approve
                        </button>
                      )}
                      <Link href={`/admin/missions/${mission.id}/edit`} className={styles.editBtn}>
                        Edit Details
                      </Link>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDeleteMission(mission.id)}
                        disabled={loading === mission.id}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'submissions' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>Contributor Submissions</h2>
              <span className={styles.countBadge}>{pendingSubmissions.length} Pending</span>
            </div>
            
            {pendingSubmissions.length === 0 ? (
              <div className={styles.emptyTable}>
                <Shield size={48} className={styles.emptyIcon} />
                <h3>No pending submissions</h3>
                <p>Work submitted by contributors will appear here for review.</p>
              </div>
            ) : (
              <div className={styles.table}>
                {pendingSubmissions.map(sub => (
                  <div key={sub.id} className={`${styles.item} glass-panel`}>
                    <div className={styles.itemInfo}>
                      <div className={styles.subMeta}>
                        <strong>{sub.user.name || sub.user.address.substring(0, 8)}</strong>
                        <span>•</span>
                        <span>{sub.mission.title}</span>
                      </div>
                      <h3>{sub.title || 'Untitled Submission'}</h3>
                      <p>{sub.evidence.substring(0, 150)}...</p>
                      {sub.links && (
                        <div className={styles.links}>
                          {sub.links.split(',').map((link: string, i: number) => (
                            <a key={i} href={link.trim()} target="_blank" className={styles.link}>{link.trim()}</a>
                          ))}
                        </div>
                      )}
                    </div>
                      <div className={styles.itemActions}>
                        <Link href={`/admin/submissions/${sub.id}`} className={styles.reviewBtn}>
                          Review Details
                          <ExternalLink size={16} />
                        </Link>
                        <button 
                          className={styles.approveBtn} 
                          onClick={() => handleApproveSubmission(sub.id)}
                          disabled={loading === sub.id}
                        >
                          <Check size={18} />
                          Quick Approve
                        </button>
                        <button 
                          className={styles.rejectBtn} 
                          onClick={() => handleRejectSubmission(sub.id)}
                          disabled={loading === sub.id}
                        >
                          <X size={18} />
                          Quick Reject
                        </button>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'users' && (
          <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
              <h2>User Management</h2>
              <span className={styles.countBadge}>{allUsers.length} Contributors</span>
            </div>
            
            <div className={styles.table}>
              {allUsers.map(user => (
                <div key={user.id} className={`${styles.item} glass-panel`}>
                  <div className={styles.itemInfo}>
                    <div className={styles.userHead}>
                      <span className={styles.userAddr}>{user.address.substring(0, 10)}...{user.address.substring(user.address.length - 8)}</span>
                      <span className="badge">{user.role}</span>
                    </div>
                    <h3>{user.name || 'Anonymous Contributor'}</h3>
                    <p>{user.bio || 'No bio provided.'}</p>
                  </div>
                  <div className={styles.itemStats}>
                    <div className={styles.stat}>
                      <label>Reputation</label>
                      <span>{user.reputation} REP</span>
                    </div>
                    <div className={styles.stat}>
                      <label>Joined</label>
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
