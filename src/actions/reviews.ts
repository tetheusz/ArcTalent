'use server'

import { db } from '@/db'
import { submissions, reviews, users, reputationEvents, missions, badgeDefinitions } from '@/db/schema'
import { eq, sql, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createContributionAttestation } from '@/lib/onchain'
import { awardBadge } from './badges'
import { checkAndAwardBadges } from '@/lib/achievements'

export async function approveSubmission(submissionId: string, reviewerId: string, feedback: string, overrideReward?: number) {
  try {
    const sub = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId),
      with: { mission: true }
    })

    if (!sub) return { success: false, error: 'Submission not found' }
    if (sub.status !== 'PENDING') return { success: false, error: 'Submission already processed' }

    const normalizedReviewerAddress = reviewerId.toLowerCase()

    // 0. Ensure reviewer exists and get their UUID
    let reviewer = await db.query.users.findFirst({
      where: eq(users.address, normalizedReviewerAddress)
    })

    if (!reviewer) {
      const result = await db.insert(users).values({
        address: normalizedReviewerAddress,
        role: 'ADMIN'
      }).returning()
      reviewer = result[0]
    }

    // 1. Create Review using UUID
    await db.insert(reviews).values({
      submissionId,
      reviewerId: reviewer.id,
      feedback,
      qualityScore: 5,
      impactScore: 5
    })

    // 2. Determine Reward and Update Submission Status
    const reward = overrideReward !== undefined ? overrideReward : sub.mission.reputationReward

    await db.update(submissions)
      .set({ status: 'APPROVED', rewardGranted: reward })
      .where(eq(submissions.id, submissionId))

    // 3. Grant Reputation to User


    
    await db.update(users)
      .set({ reputation: sql`${users.reputation} + ${reward}` })
      .where(eq(users.id, sub.userId))

    // 4. Log Reputation Event
    await db.insert(reputationEvents).values({
      userId: sub.userId,
      amount: reward,
      category: 'MISSION_COMPLETED',
      description: `Earned for mission: ${sub.mission.title}`
    })

    // 5. On-Chain Attestation
    try {
      const user = await db.query.users.findFirst({ where: eq(users.id, sub.userId) })
      if (user?.address) {
        await createContributionAttestation(submissionId, user.address, {
          missionTitle: sub.mission.title,
          reward
        })
      }
    } catch (e) {
      console.error('On-chain attestation failed (non-blocking):', e)
    }

    // 6. Check for Badge Milestones
    await checkAndAwardBadges(sub.userId)

    revalidatePath(`/missions/${sub.missionId}`)
    revalidatePath(`/profile`)
    revalidatePath(`/admin`)
    return { success: true, error: undefined }
  } catch (error: any) {
    console.error('Approval error:', error)
    return { success: false, error: `Failed to approve submission: ${error.message || 'Database error'}` }
  }
}

export async function rejectSubmission(submissionId: string, reviewerId: string, feedback: string) {
  try {
    const sub = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId)
    })

    if (!sub) return { success: false, error: 'Submission not found' }
    if (sub.status !== 'PENDING') return { success: false, error: 'Submission already processed' }

    const normalizedReviewerAddress = reviewerId.toLowerCase()

    // 0. Get reviewer UUID
    const reviewer = await db.query.users.findFirst({
      where: eq(users.address, normalizedReviewerAddress)
    })

    if (!reviewer) throw new Error('Reviewer not found')

    // 1. Create Review (even for rejection, we store feedback)
    await db.insert(reviews).values({
      submissionId,
      reviewerId: reviewer.id,
      feedback,
      qualityScore: 0,
      impactScore: 0
    })

    // 2. Update Submission Status
    await db.update(submissions)
      .set({ status: 'REJECTED' })
      .where(eq(submissions.id, submissionId))

    revalidatePath(`/admin`)
    revalidatePath(`/missions/${sub.missionId}`)
    return { success: true, error: undefined }
  } catch (error: any) {
    console.error('Rejection error:', error)
    return { success: false, error: `Failed to reject submission: ${error.message || 'Database error'}` }
  }
}

export async function getSubmissionById(id: string) {
  try {
    const sub = await db.query.submissions.findFirst({
      where: eq(submissions.id, id),
      with: {
        mission: true,
        user: true,
      }
    })
    return sub || null
  } catch (error) {
    console.error('Error fetching submission:', error)
    return null
  }
}
