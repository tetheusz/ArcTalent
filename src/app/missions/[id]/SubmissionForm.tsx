'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useAccount } from 'wagmi'
import { submitMissionWork } from '@/actions/submissions'
import styles from './mission-detail.module.css'

interface SubmissionFormProps {
  missionId: string
  requirements: string
}

export default function SubmissionForm({ missionId, requirements }: SubmissionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [evidence, setEvidence] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { address, isConnected } = useAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    setStatus('loading')
    const result = await submitMissionWork({
      missionId,
      userId: address,
      title: '',
      links: '',
      evidence,
    })

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.submissionSuccess}>
        <CheckCircle size={32} color="var(--accent-success)" />
        <p>Proof submitted successfully!</p>
        <button onClick={() => setIsOpen(false)} className="btn-secondary">Close</button>
      </div>
    )
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)} 
        className="btn-primary" 
        style={{ width: '100%', marginTop: '1rem' }}
      >
        Submit
        <Send size={18} />
      </button>
    )
  }

  return (
    <div className={styles.submissionFormOverlay}>
      <form onSubmit={handleSubmit} className={styles.submissionForm}>
        <h3>Submit Proof of Work</h3>
        <p className={styles.requirementsHint}>
          Ensure your submission meets all requirements:
        </p>
        <pre className={styles.reqText}>{requirements}</pre>
        
        <textarea
          required
          placeholder="Paste links, transaction hashes, or evidence here..."
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          rows={5}
          className={styles.textarea}
        />
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            onClick={() => setIsOpen(false)} 
            className="btn-secondary"
            disabled={status === 'loading'}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={status === 'loading' || !evidence.trim()}
          >
            {status === 'loading' ? 'Sending...' : 'Confirm Submission'}
          </button>
        </div>
        
        {status === 'error' && (
          <div className={styles.errorMsg}>
            <AlertCircle size={14} />
            <span>Failed to submit. Try again.</span>
          </div>
        )}
      </form>
    </div>
  )
}
