'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { updateProtocol } from '@/actions/protocols'
import styles from './edit-protocol.module.css'

export default function EditProtocolPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logoUrl: ''
  })

  useEffect(() => {
    async function fetchProtocol() {
      const response = await fetch(`/api/protocols/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.name || '',
          description: data.description || '',
          website: data.website || '',
          logoUrl: data.logoUrl || ''
        })
      }
    }
    fetchProtocol()
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const res = await updateProtocol(id, formData)

    if (res.success) {
      router.push('/admin')
      router.refresh()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className={styles.main}>
        <Link href="/admin" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Admin
        </Link>

        <div className={styles.header}>
          <h1>Edit Protocol Profile</h1>
          <p>Update the public profile and branding of the protocol.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Protocol Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Website URL</label>
            <input 
              type="url" 
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Logo URL</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '8px'
              }}>
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>NO LOGO</span>
                )}
              </div>
              <input 
                type="text" 
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://... (PNG/JPG)"
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea 
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className={styles.footer}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
              <Save size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
