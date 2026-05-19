'use server'

import { db } from '@/db'
import { submissions, users } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

export async function submitMissionWork(data: {
  missionId: string;
  userId: string;
  title: string;
  links: string;
  evidence: string;
}) {
  try {
    const normalizedAddress = data.userId.toLowerCase()
    
    // 1. Ensure user exists and get their UUID
    let user = await db.query.users.findFirst({
      where: eq(users.address, normalizedAddress)
    })

    if (!user) {
      const result = await db.insert(users).values({
        address: normalizedAddress,
        role: 'CONTRIBUTOR'
      }).returning()
      user = result[0]
    }

    // 2. Insert submission with the correct UUID
    const submission = await db.insert(submissions).values({
      ...data,
      userId: user.id,
      status: 'PENDING'
    }).returning()

    revalidatePath(`/missions/${data.missionId}`)
    revalidatePath(`/profile`)
    return { success: true, submission: submission[0] }
  } catch (error: any) {
    console.error('Submission error:', error)
    return { error: `Submission failed: ${error.message || 'Unknown error'}` }
  }
}

export async function updateSubmission(id: string, data: any) {
  try {
    const updated = await db.update(submissions)
      .set(data)
      .where(eq(submissions.id, id))
      .returning()
    
    revalidatePath(`/submissions/${id}`)
    return { success: true, submission: updated[0] }
  } catch (error: any) {
    console.error('Update submission error:', error)
    return { error: `Update failed: ${error.message}` }
  }
}
