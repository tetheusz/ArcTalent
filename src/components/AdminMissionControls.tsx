'use client'

import { useState, useEffect } from 'react'
import { Settings, Trash2, Edit } from 'lucide-react'
import { useAccount } from 'wagmi'
import { getUserRole } from '@/actions/users'
import { deleteMission } from '@/actions/missions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminMissionControls({ missionId }: { missionId: string }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const { address, isConnected } = useAccount()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      getUserRole(address).then(data => {
        setIsAdmin(data.role === 'ADMIN')
      })
    }
  }, [isConnected, address])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this mission? This cannot be undone.')) return
    setLoading(true)
    const res = await deleteMission(missionId)
    if (res.success) {
      router.push('/missions')
      router.refresh()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  if (!isAdmin) return null

  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.75rem', 
      padding: '1.5rem', 
      background: 'rgba(239, 68, 68, 0.05)', 
      border: '1px solid rgba(239, 68, 68, 0.1)',
      borderRadius: '12px',
      marginBottom: '2rem'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 900, color: '#ef4444', letterSpacing: '0.1em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Settings size={14} />
          ADMINISTRATIVE OVERRIDE
        </div>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
          You have permission to modify or terminate this mission.
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link 
          href={`/admin/missions/${missionId}/edit`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.6rem 1rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 800,
            textDecoration: 'none'
          }}
        >
          <Edit size={14} />
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          disabled={loading}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.6rem 1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          <Trash2 size={14} />
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
