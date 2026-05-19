import { db } from '@/db'
import { submissions, onChainProofs } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Target, ExternalLink, CheckCircle, XCircle, Info, Calendar } from 'lucide-react'
import Link from 'next/link'
import styles from './submission-review.module.css'
import ReviewActions from './ReviewActions'

export default async function SubmissionReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, id),
    with: {
      mission: {
        with: { protocol: true }
      },
      user: true,
      proofs: true
    }
  })

  if (!submission) notFound()

  return (
    <div className="container">
      <Link href="/admin" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={`${styles.header} glass-panel`}>
            <div className={styles.headerTop}>
              <span className={`${styles.statusBadge} ${styles[submission.status.toLowerCase()]}`}>
                {submission.status}
              </span>
              <span className={styles.date}>
                <Calendar size={14} />
                Submitted on {new Date(submission.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1>{submission.title || 'Untitled Submission'}</h1>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <User size={16} />
                <span>By: <strong>{submission.user.name || submission.user.address}</strong></span>
              </div>
              <div className={styles.metaItem}>
                <Target size={16} />
                <span>Mission: <strong>{submission.mission.title}</strong></span>
              </div>
            </div>
          </div>

          <div className={`${styles.contentSection} glass-panel`}>
            <h2>Evidence & Proof of Work</h2>
            <div className={styles.evidenceText}>
              {submission.evidence}
            </div>

            {submission.links && (
              <div className={styles.linksSection}>
                <h3>External Links</h3>
                <div className={styles.linksGrid}>
                  {submission.links.split(',').map((link, i) => (
                    <a key={i} href={link.trim()} target="_blank" className={styles.linkCard}>
                      <ExternalLink size={16} />
                      {link.trim()}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={`${styles.actionCard} glass-panel`}>
            <h3>Review Actions</h3>
            <p>Review the evidence above and take action on this submission.</p>
            
            <ReviewActions 
              submissionId={submission.id} 
              status={submission.status} 
              reputationReward={submission.mission.reputationReward}
            />
          </div>

          <div className={`${styles.missionCard} glass-panel`}>
            <h3>Mission Context</h3>
            <div className={styles.missionBrief}>
              <strong>Requirements:</strong>
              <p>{submission.mission.requirements}</p>
            </div>
            <div className={styles.rewardInfo}>
              <label>Reward</label>
              <span>{submission.mission.reputationReward} REP</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
