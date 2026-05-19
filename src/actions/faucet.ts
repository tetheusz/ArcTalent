'use server'

import { db } from '@/db'
import { faucetRequests } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function requestFaucet(missionId: string, userId: string) {
  try {
    const existing = await db.select()
      .from(faucetRequests)
      .where(and(eq(faucetRequests.missionId, missionId), eq(faucetRequests.userId, userId)))
      .limit(1)

    if (existing.length > 0) {
      return { error: 'You have already requested a faucet for this mission.' }
    }

    const request = await db.insert(faucetRequests).values({
      missionId,
      userId,
      status: 'PENDING'
    }).returning()

    revalidatePath(`/missions/${missionId}`)
    return { success: true, request: request[0] }
  } catch (error) {
    console.error('Faucet request error:', error)
    return { error: 'Failed to submit faucet request.' }
  }
}
