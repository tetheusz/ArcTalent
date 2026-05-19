'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

interface Protocol {
  id: string
  name: string
  slug: string
}

export default function MissionBoardFilters({ protocols }: { protocols: Protocol[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  
  const currentProtocol = searchParams.get('protocol') || 'all'

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search) params.set('q', search)
    else params.delete('q')
    router.push(`/missions?${params.toString()}`)
  }

  const handleProtocolChange = (protocolSlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (protocolSlug === 'all') params.delete('protocol')
    else params.set('protocol', protocolSlug)
    router.push(`/missions?${params.toString()}`)
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '800px' }}>
      <form onSubmit={handleSearch} style={{ position: 'relative', flex: 1 }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }} />
        <input 
          type="text" 
          placeholder="Search missions..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '0.75rem 1rem 0.75rem 3rem', 
            color: 'white', 
            borderRadius: '4px', 
            width: '100%' 
          }} 
        />
      </form>

      <div style={{ position: 'relative' }}>
        <select 
          value={currentProtocol}
          onChange={(e) => handleProtocolChange(e.target.value)}
          style={{ 
            appearance: 'none',
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '0.75rem 3rem 0.75rem 1.5rem', 
            color: 'white', 
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 900,
            cursor: 'pointer',
            minWidth: '180px'
          }}
        >
          <option value="all">ALL PROTOCOLS</option>
          {protocols.map(p => (
            <option key={p.id} value={p.slug}>{p.name.toUpperCase()}</option>
          ))}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.4)' }} />
      </div>
    </div>
  )
}
