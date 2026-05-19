'use server'

import { db } from '@/db'
import { userBadges, badgeDefinitions, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { mintSoulboundBadge } from '@/lib/onchain'

export async function awardBadge(userId: string, badgeDefId: string) {
  try {
    // 1. Check if user already has this badge
    const existing = await db.query.userBadges.findFirst({
      where: (ub, { and, eq }) => and(eq(ub.userId, userId), eq(ub.badgeId, badgeDefId))
    })

    if (existing) return { error: 'User already has this badge' }

    // 2. Record in DB
    const [newBadge] = await db.insert(userBadges).values({
      userId,
      badgeId: badgeDefId
    }).returning()

    // 3. Mint On-Chain SBT
    try {
      const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
      const badgeDef = await db.query.badgeDefinitions.findFirst({ where: eq(badgeDefinitions.id, badgeDefId) })
      
      if (user?.address && badgeDef) {
        await mintSoulboundBadge(newBadge.id, user.address, badgeDef.name)
      }
    } catch (e) {
      console.error('SBT Mint failed (non-blocking):', e)
    }

    revalidatePath(`/profile`)
    return { success: true, badge: newBadge }
  } catch (error) {
    console.error('Error awarding badge:', error)
  }
}

export async function awardBadgeByName(userId: string, badgeName: string) {
  try {
    const badgeDef = await db.query.badgeDefinitions.findFirst({
      where: eq(badgeDefinitions.name, badgeName)
    })
    
    if (!badgeDef) {
      console.error(`Badge definition not found: ${badgeName}`)
      return { error: 'Badge not found' }
    }
    
    return await awardBadge(userId, badgeDef.id)
  } catch (error) {
    console.error('Error awarding badge by name:', error)
    return { error: 'Failed to award badge' }
  }
}
