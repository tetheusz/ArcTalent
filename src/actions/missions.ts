'use server'

import { db } from '@/db'
import { missions, submissions, reviews, users } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { checkAndAwardBadges } from '@/lib/achievements'

export async function createMission(data: {
  title: string;
  description: string;
  requirements: string;
  category: string;
  difficulty: string;
  reputationReward: number;
  protocolId: string;
  deadline?: Date;
}) {
  try {
    const result = await db.insert(missions).values({
      ...data,
      status: 'PUBLISHED' // Default to published for now
    }).returning()
    
    revalidatePath('/missions')
    revalidatePath('/admin/missions')
    return { success: true, mission: result[0] }
  } catch (error: any) {
    console.error('Error creating mission:', error)
    return { success: false, error: error.message || 'Failed to create mission' }
  }
}

export async function submitMission(data: {
  missionId: string;
  userId: string;
  title: string;
  evidence: string;
  links: string;
}) {
  try {
    const normalizedAddress = data.userId.toLowerCase()
    const user = await db.query.users.findFirst({
      where: eq(users.address, normalizedAddress)
    })

    if (!user) throw new Error('User not synced. Please visit profile first.')

    const result = await db.insert(submissions).values({
      ...data,
      userId: user.id,
      status: 'PENDING'
    }).returning()
    
    revalidatePath(`/missions/${data.missionId}`)
    return { success: true, submission: result[0] }
  } catch (error: any) {
    console.error('Error submitting mission:', error)
    return { success: false, error: error.message || 'Failed to submit mission' }
  }
}

export async function reviewSubmission(submissionId: string, reviewerId: string, data: {
  status: 'APPROVED' | 'REJECTED';
  feedback: string;
  qualityScore: number;
  impactScore: number;
  rewardGranted?: number;
}) {
  try {
    const normalizedReviewerAddress = reviewerId.toLowerCase()
    const reviewer = await db.query.users.findFirst({
      where: eq(users.address, normalizedReviewerAddress)
    })

    if (!reviewer) throw new Error('Reviewer not found')

    const submission = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId)
    })

    if (!submission) throw new Error('Submission not found')

    let subId: string = submission.userId;
    const result = db.transaction((tx) => {
      // 1. Create the review
      tx.insert(reviews).values({
        submissionId,
        reviewerId: reviewer.id,
        feedback: data.feedback,
        qualityScore: data.qualityScore,
        impactScore: data.impactScore
      }).run()

      // 2. Update submission status
      tx.update(submissions)
        .set({ 
          status: data.status,
          rewardGranted: data.rewardGranted
        })
        .where(eq(submissions.id, submissionId))
        .run()

      // 3. If approved, grant reputation (XP) to the user
      if (data.status === 'APPROVED' && data.rewardGranted) {
        tx.update(users)
          .set({ reputation: sql`${users.reputation} + ${data.rewardGranted}` })
          .where(eq(users.id, subId))
          .run()
      }

      return { success: true, error: undefined }
    })

    if (subId) {
      revalidatePath('/admin/reviews')
      revalidatePath(`/profile/${subId}`)
      await checkAndAwardBadges(subId)
    }
    return result
  } catch (error: any) {
    console.error('Error reviewing submission:', error)
    return { success: false, error: error.message || 'Failed to review submission' }
  }
}

export async function approveMission(id: string) {
  try {
    await db.update(missions)
      .set({ status: 'PUBLISHED' })
      .where(eq(missions.id, id))
    
    revalidatePath('/admin/missions')
    revalidatePath('/missions')
    return { success: true, error: undefined }
  } catch (error: any) {
    console.error('Error approving mission:', error)
    return { success: false, error: error.message || 'Failed to approve mission' }
  }
}

export async function updateMission(id: string, data: {
  title: string;
  description: string;
  requirements: string;
  category: string;
  difficulty: string;
  reputationReward: number;
  deadline?: Date | null;
}) {
  try {
    await db.update(missions)
      .set(data)
      .where(eq(missions.id, id))
    
    revalidatePath('/missions')
    revalidatePath(`/missions/${id}`)
    revalidatePath('/admin/missions')
    return { success: true, error: undefined }
  } catch (error: any) {
    console.error('Error updating mission:', error)
    return { success: false, error: error.message || 'Failed to update mission' }
  }
}

export async function deleteMission(id: string) {
  try {
    await db.delete(missions).where(eq(missions.id, id))
    revalidatePath('/admin/missions')
    revalidatePath('/missions')
    return { success: true, error: undefined }
  } catch (error: any) {
    console.error('Error deleting mission:', error)
    return { success: false, error: error.message || 'Failed to delete mission' }
  }
}
