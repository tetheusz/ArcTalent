'use server'

import { db } from '@/db'
import { protocols, protocolApplications, users, protocolAdmins } from '@/db/schema'
import { eq, count, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { awardBadgeByName } from './badges'
import { missions, submissions } from '@/db/schema'

export async function createProtocol(data: {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  website?: string;
  twitter?: string;
}) {
  try {
    const result = await db.insert(protocols).values({
      ...data,
      isVerified: true
    }).returning()
    
    revalidatePath('/admin/protocols')
    return { success: true, protocol: result[0] }
  } catch (error: any) {
    console.error('Error creating protocol:', error)
    return { error: error.message || 'Failed to create protocol' }
  }
}

export async function getProtocols() {
  try {
    return await db.query.protocols.findMany()
  } catch (error) {
    console.error('Error fetching protocols:', error)
    return []
  }
}

export async function deleteProtocol(id: string) {
  try {
    await db.delete(protocols).where(eq(protocols.id, id))
    revalidatePath('/admin/protocols')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting protocol:', error)
    return { error: error.message || 'Failed to delete protocol' }
  }
}

export async function applyProtocol(data: {
  userId: string; // This is the address from the client
  name: string;
  website: string;
  twitter: string;
  description: string;
}) {
  try {
    // Look up the user by address to get their UUID
    const user = await db.query.users.findFirst({
      where: eq(users.address, data.userId.toLowerCase())
    })

    if (!user) throw new Error('User not found. Please sync your wallet first.')

    await db.insert(protocolApplications).values({
      ...data,
      userId: user.id, // Use the correct UUID
      status: 'PENDING'
    })
    
    // Award "DApp Architect" for applying
    await awardBadgeByName(user.id, 'DApp Architect')
    
    revalidatePath('/admin/protocols')
    return { success: true }
  } catch (error: any) {
    console.error('Error applying protocol:', error)
    return { error: error.message || 'Failed to submit application' }
  }
}

export async function getProtocolApplications() {
  try {
    return await db.query.protocolApplications.findMany({
      orderBy: (apps, { desc }) => [desc(apps.createdAt)]
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

export async function approveProtocolApplication(applicationId: string) {
  try {
    const app = await db.query.protocolApplications.findFirst({
      where: eq(protocolApplications.id, applicationId)
    })

    if (!app) throw new Error('Application not found')

    const result = db.transaction((tx) => {
      // Create protocol
      const newProtocol = tx.insert(protocols).values({
        name: app.name,
        slug: app.name.toLowerCase().replace(/ /g, '-'),
        description: app.description,
        website: app.website,
        twitter: app.twitter,
        isVerified: true
      }).returning().get()

      // Link user as protocol admin
      tx.insert(protocolAdmins).values({
        userId: app.userId,
        protocolId: newProtocol.id
      }).run()

      // Update application status
      tx.update(protocolApplications)
        .set({ status: 'APPROVED' })
        .where(eq(protocolApplications.id, applicationId))
        .run()

      return { success: true, userId: app.userId, error: undefined }
    })

    if (result.success && result.userId) {
      await awardBadgeByName(result.userId, 'Protocol Founder')
    }
    
    return result
  } catch (error: any) {
    console.error('Error approving application:', error)
    return { success: false, error: error.message || 'Failed to approve application' }
  } finally {
    revalidatePath('/admin/protocols')
  }
}

// Aliases for AdminTabs
export const approveProtocol = approveProtocolApplication;

export async function rejectProtocol(id: string) {
  try {
    await db.update(protocolApplications)
      .set({ status: 'REJECTED' })
      .where(eq(protocolApplications.id, id))
    
    revalidatePath('/admin/protocols')
    return { success: true }
  } catch (error: any) {
    console.error('Error rejecting protocol:', error)
    return { error: error.message || 'Failed to reject protocol' }
  }
}

export async function getProtocolDashboardData(protocolId: string) {
  try {
    const activeMissions = await db.query.missions.findMany({
      where: eq(missions.protocolId, protocolId),
      with: {
        submissions: true
      }
    })

    const totalActiveMissions = activeMissions.filter(m => m.status === 'PUBLISHED').length
    
    // Flatten all submissions
    const allSubmissions = activeMissions.flatMap(m => m.submissions)
    
    const pendingReviews = allSubmissions.filter(s => s.status === 'PENDING').length
    
    // Unique contributors (by counting unique userIds in submissions)
    const uniqueUserIds = new Set(allSubmissions.map(s => s.userId))
    const totalContributors = uniqueUserIds.size
    
    // Total reputation issued (assuming we sum reputationReward for approved submissions)
    // Or we just calculate what is theoretically issued
    const totalRepIssued = allSubmissions
      .filter(s => s.status === 'APPROVED')
      .reduce((acc, sub) => {
        const mission = activeMissions.find(m => m.id === sub.missionId)
        return acc + (mission?.reputationReward || 0)
      }, 0)

    return {
      success: true,
      stats: {
        totalContributors,
        totalActiveMissions,
        totalRepIssued,
        pendingReviews
      },
      missions: activeMissions
    }
  } catch (error) {
    console.error('Error fetching protocol dashboard data:', error)
    return { success: false, error: 'Failed to fetch dashboard data' }
  }
}

export async function updateProtocol(id: string, data: {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
}) {
  try {
    await db.update(protocols)
      .set(data)
      .where(eq(protocols.id, id))
      
    revalidatePath('/admin/protocols')
    revalidatePath(`/admin/protocols/${id}/edit`)
    return { success: true }
  } catch (error: any) {
    console.error('Error updating protocol:', error)
    return { success: false, error: error.message || 'Failed to update protocol' }
  }
}
