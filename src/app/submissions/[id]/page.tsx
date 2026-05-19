import { db } from '@/db'
import { submissions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit3, Calendar, Target, User, Info } from 'lucide-react'
import Link from 'next/link'
import styles from './submission-view.module.css'

export default async function UserSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
    with: {
      mission: {
        with: { protocol: true }
      },
      user: true
    }
  })

  if (!submission) notFound()

  const isPending = submission.status === 'PENDING'
  const missionDeadline = submission.mission.deadline
  const canEdit = isPending && (!missionDeadline || new Date() < new Date(missionDeadline))

  return (
    <div className="container">
      <Link href={`/profile/${submission.user.address}`} className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Profile
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={`${styles.header} glass-panel`}>
            <div className={styles.headerTop}>
              <span className={`${styles.statusBadge} ${styles[submission.status.toLowerCase()]}`}>
                {submission.status}
              </span>
              {canEdit && (
                <Link href={`/submissions/${id}/edit`} className="btn-primary">
                  <Edit3 size={18} />
                  Edit Submission
                </Link>
              )}
            </div>
            <h1>{submission.title || 'Untitled Submission'}</h1>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Target size={16} />
                <span>Mission: <strong>{submission.mission.title}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>Submitted on {new Date(submission.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className={`${styles.contentSection} glass-panel`}>
            <h2>My Submission Details</h2>
            <div className={styles.evidenceContainer}>
              {submission.evidence}
            </div>

            {submission.links && (
              <div className={styles.linksSection}>
                <h3>Links Provided</h3>
                <div className={styles.linksGrid}>
                  {submission.links.split(',').map((link, i) => (
                    <div key={i} className={styles.linkItem}>
                      <Info size={14} />
                      {link.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={`${styles.statusCard} glass-panel`}>
            <h3>Review Status</h3>
            <div className={styles.statusInfo}>
              {isPending ? (
                <p>Your submission is currently in the queue. An admin will review it soon.</p>
              ) : (
                <p>This submission has been reviewed and is now {submission.status.toLowerCase()}.</p>
              )}
            </div>
          </div>
          
          <div className={`${styles.rewardCard} glass-panel`}>
            <label>Potential Reward</label>
            <span>{submission.mission.reputationReward} REP</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
