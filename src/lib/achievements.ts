import { db } from '@/db'
import { submissions, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { awardBadgeByName } from '@/actions/badges'

export async function checkAndAwardBadges(userId: string) {
  try {
    const allApproved = await db.query.submissions.findMany({
      where: and(
        eq(submissions.userId, userId),
        eq(submissions.status, 'APPROVED')
      ),
      with: { mission: true }
    })

    const totalCount = allApproved.length
    const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
    const reputation = user?.reputation || 0

    // General Badges
    if (totalCount >= 1) await awardBadgeByName(userId, 'Genesis Contributor')
    if (reputation >= 100) await awardBadgeByName(userId, 'Reputation Pioneer')
    if (reputation >= 500) await awardBadgeByName(userId, 'Arc Elite')

    // Category Specific Badges
    const categoryCounts = allApproved.reduce((acc: any, curr) => {
      const cat = curr.mission.category
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})

    // Developer
    if (categoryCounts['Developer'] >= 1) await awardBadgeByName(userId, 'Junior Developer')
    if (categoryCounts['Developer'] >= 5) await awardBadgeByName(userId, 'Senior Architect')
    if (categoryCounts['Developer'] >= 10) await awardBadgeByName(userId, 'Protocol Master')

    // Sentinel
    if (categoryCounts['Sentinel'] >= 1) await awardBadgeByName(userId, 'Bug Hunter')
    if (categoryCounts['Sentinel'] >= 5) await awardBadgeByName(userId, 'Sentinel Scout')
    if (categoryCounts['Sentinel'] >= 10) await awardBadgeByName(userId, 'Sanctum Guardian')

    // Creator
    if (categoryCounts['Creator'] >= 1) await awardBadgeByName(userId, 'Content Creator')
    if (categoryCounts['Creator'] >= 5) await awardBadgeByName(userId, 'Influencer Path')
    if (categoryCounts['Creator'] >= 10) await awardBadgeByName(userId, 'Media Mogul')

    // Scholar
    if (categoryCounts['Scholar'] >= 1) await awardBadgeByName(userId, 'Active Researcher')
    if (categoryCounts['Scholar'] >= 5) await awardBadgeByName(userId, 'Ecosystem Sage')

    // Strategist
    if (categoryCounts['Strategist'] >= 1) await awardBadgeByName(userId, 'Community Catalyst')
    if (categoryCounts['Strategist'] >= 10) await awardBadgeByName(userId, 'Guild Leader')

  } catch (error) {
    console.error('Error in checkAndAwardBadges:', error)
  }
}
