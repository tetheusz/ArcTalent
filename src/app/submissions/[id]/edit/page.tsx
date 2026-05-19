'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Info } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { updateSubmission } from '@/actions/submissions'
import styles from './edit-submission.module.css'

export default function UserEditSubmissionPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { address, isConnected } = useAccount()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    links: '',
    evidence: ''
  })

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/submissions/${id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title || '',
          links: data.links || '',
          evidence: data.evidence || ''
        })
      }
    }
    fetchData()
  }, [id])
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const res = await updateSubmission(id, formData)

    if (res.success) {
      router.push(`/submissions/${id}`)
      router.refresh()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className={styles.main}>
        <Link href={`/submissions/${id}`} className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Submission
        </Link>

        <div className={styles.header}>
          <h1>Edit Your Submission</h1>
          <p>You can update your work while it is still under review.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give your work a clear title"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Links</label>
            <input 
              type="text" 
              value={formData.links}
              onChange={(e) => setFormData({ ...formData, links: e.target.value })}
              placeholder="Update URLs (GitHub, Tweets, etc.)"
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Evidence & Description</label>
            <textarea 
              rows={10}
              value={formData.evidence}
              onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              placeholder="Provide updated evidence of your work..."
              required
            />
          </div>

          <div className={styles.footer}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save Changes'}
              <Save size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
