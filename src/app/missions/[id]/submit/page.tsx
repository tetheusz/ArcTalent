'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, Link as LinkIcon, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { submitMissionWork } from '@/actions/submissions'
import styles from './submit-page.module.css'

export default function MissionSubmitPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { address, isConnected } = useAccount()
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    title: '',
    links: '',
    evidence: ''
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    setStatus('loading')
    const result = await submitMissionWork({
      missionId: id,
      userId: address,
      ...formData
    })

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      alert(result.error || 'Failed to submit.')
    }
  }

  if (status === 'success') {
    return (
      <div className="container">
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} color="var(--accent-success)" />
          </div>
          <h1>Submission Sent!</h1>
          <p>Your work has been recorded on-chain and is now awaiting manual review by the protocol team.</p>
          <div className={styles.actions}>
            <Link href={`/missions/${id}`} className="btn-secondary">Back to Mission</Link>
            <Link href={`/profile/${address}`} className="btn-primary">View My Profile</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.main}>
          <Link href={`/missions/${id}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Mission
          </Link>

          <div className={styles.header}>
            <h1>Submit Your Work</h1>
            <p>Provide all necessary evidence to verify your contribution.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Submission Title</label>
              <input 
                type="text" 
                placeholder="e.g. Translation of Docs to Portuguese" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>External Links (Optional)</label>
              <div className={styles.linkInput}>
                <LinkIcon size={18} className={styles.inputIcon} />
                <input 
                  type="text" 
                  placeholder="https://github.com/..., https://twitter.com/..." 
                  value={formData.links}
                  onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                />
              </div>
              <span className={styles.hint}>Separate multiple links with commas.</span>
            </div>

            <div className={styles.inputGroup}>
              <label>Detailed Evidence & Notes</label>
              <textarea 
                required
                placeholder="Explain what you did and provide any additional context..." 
                rows={8}
                value={formData.evidence}
                onChange={(e) => setFormData({ ...formData, evidence: e.target.value })}
              />
            </div>

            <div className={styles.footer}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Contribution'}
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

        <aside className={styles.sidebar}>
          <div className={`${styles.infoCard} glass-panel`}>
            <Info size={24} color="var(--accent-primary)" />
            <h3>Submission Tips</h3>
            <p>Make sure your submission is easy to verify:</p>
            <ul>
              <li>Double-check all links are public.</li>
              <li>Include screenshots if applicable (via links).</li>
              <li>Be concise but thorough in your evidence.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
