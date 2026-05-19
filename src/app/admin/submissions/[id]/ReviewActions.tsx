'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { approveSubmission, rejectSubmission } from '@/actions/reviews'
import { useAccount } from 'wagmi'
import styles from './submission-review.module.css'

interface ReviewActionsProps {
  submissionId: string
  status: string
  reputationReward: number
}

export default function ReviewActions({ submissionId, status, reputationReward }: ReviewActionsProps) {
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [rewardAmount, setRewardAmount] = useState(reputationReward.toString())
  const { address } = useAccount()

  const handleApprove = async () => {
    if (!address) return alert('Connect your wallet')
    setLoading(true)
    const res = await approveSubmission(submissionId, address, comment || 'Work approved!', Number(rewardAmount))
    if (res.success) {
      window.location.reload()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!address) return alert('Connect your wallet')
    if (!comment) return alert('Please provide a reason for rejection in the comment box.')
    
    setLoading(true)
    const res = await rejectSubmission(submissionId, address, comment)
    if (res.success) {
      window.location.reload()
    } else {
      alert(res.error)
      setLoading(false)
    }
  }

  if (status === 'APPROVED') {
    return (
      <div className={styles.finalStatus}>
        <CheckCircle color="var(--accent-success)" />
        <span>Approved</span>
      </div>
    )
  }

  return (
    <div className={styles.actionForm}>
      <div className={styles.rewardInputContainer}>
        <label>Reputation to Grant (Override)</label>
        <input 
          type="number" 
          value={rewardAmount}
          onChange={(e) => setRewardAmount(e.target.value)}
          className={styles.commentInput}
          style={{ marginBottom: '10px' }}
        />
      </div>
      <textarea 
        placeholder="Add a review comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={styles.commentInput}
      />
      <div className={styles.buttonGroup}>
        <button 
          className={styles.approveFull} 
          onClick={handleApprove}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Approve & Attest'}
          <CheckCircle size={18} />
        </button>
        <button 
          className={styles.rejectFull} 
          onClick={handleReject}
          disabled={loading}
        >
          Reject
          <XCircle size={18} />
        </button>
      </div>
    </div>
  )
}
