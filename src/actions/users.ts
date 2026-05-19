'use server'

import { db } from '@/db'
import { users, contributorProfiles, onChainProofs, protocolAdmins, protocols } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { walletClient } from '@/lib/onchain'

export async function getUserRole(address: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.address, address.toLowerCase())
    })
    return { role: user?.role || 'CONTRIBUTOR' }
  } catch (error) {
    console.error('Error fetching user role:', error)
    return { role: 'CONTRIBUTOR' }
  }
}

export async function syncUser(address: string) {
  try {
    const normalizedAddress = address.toLowerCase()
    
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.address, normalizedAddress)
    })

    if (!existingUser) {
      console.log('Creating new user for:', normalizedAddress)
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase()
      const role = normalizedAddress === adminAddress ? 'ADMIN' : 'CONTRIBUTOR'
      
      await db.insert(users).values({
        address: normalizedAddress,
        role: role,
        reputation: 0,
      })
      return { success: true, isNew: true, chosenArchetype: null }
    }

    return { success: true, isNew: false, chosenArchetype: existingUser.chosenArchetype }
  } catch (error) {
    console.error('Error syncing user:', error)
    return { error: 'Failed to sync user' }
  }
}

export async function updateChosenArchetype(address: string, archetype: string) {
  try {
    const normalizedAddress = address.toLowerCase()
    await db.update(users)
      .set({ chosenArchetype: archetype })
      .where(eq(users.address, normalizedAddress))
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating archetype:', error)
    return { success: false }
  }
}



export async function mintArchetypeSBT(address: string, className: string, level: number) {
  try {
    const normalizedAddress = address.toLowerCase() as `0x${string}`
    
    if (!walletClient) {
      throw new Error('Admin wallet not configured')
    }

    const badgeData = `ARCHETYPE:${className}:Level${level}`
    const SBT_CONTRACT_ADDRESS = process.env.SBT_CONTRACT_ADDRESS as `0x${string}`

    if (!SBT_CONTRACT_ADDRESS) {
      throw new Error('SBT contract address not configured')
    }

    console.log(`[SBT] Minting for ${normalizedAddress}: ${badgeData}`)

    const hash = await walletClient.writeContract({
      address: SBT_CONTRACT_ADDRESS,
      abi: [{
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'badgeName', type: 'string' }
        ],
        outputs: [{ name: 'tokenId', type: 'uint256' }],
      }],
      functionName: 'mint',
      args: [normalizedAddress, badgeData],
    })

    // Record proof
    await db.insert(onChainProofs).values({
      entityType: 'USER',
      entityId: normalizedAddress,
      proofType: 'SBT',
      transactionHash: hash,
      chainId: 5042002, // Arc Testnet
    })

    revalidatePath(`/profile/${address}`)
    return { success: true, hash }
  } catch (error: any) {
    console.error('Error minting SBT:', error)
    return { error: error.message || 'Failed to mint SBT' }
  }
}

export async function updateUserProfile(address: string, data: {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  skills?: string;
}) {
  try {
    const normalizedAddress = address.toLowerCase()
    console.log('[Profile] Updating profile for:', normalizedAddress, data)
    
    // 1. Update main user info
    const updatePayload: any = {
      updatedAt: new Date(),
    }
    if (data.name !== undefined) updatePayload.name = data.name
    if (data.bio !== undefined) updatePayload.bio = data.bio
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl

    await db.update(users)
      .set(updatePayload)
      .where(eq(users.address, normalizedAddress))

    // 2. Update contributor profile (skills)
    const user = await db.query.users.findFirst({
      where: eq(users.address, normalizedAddress)
    })
    
    if (user && data.skills !== undefined) {
      console.log('[Profile] Syncing skills for user:', user.id)
      await db.insert(contributorProfiles)
        .values({
          userId: user.id,
          skills: data.skills,
        })
        .onConflictDoUpdate({
          target: contributorProfiles.userId,
          set: { skills: data.skills }
        })
    }

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('[Profile] Update profile error:', error)
    return { success: false, error: error.message || 'Failed to update profile' }
  }
}

export async function getContributorStats(address: string) {
  try {
    const normalizedAddress = address.toLowerCase()
    const user = await db.query.users.findFirst({
      where: eq(users.address, normalizedAddress),
      with: {
        submissions: {
          with: { mission: true }
        }
      }
    })

    if (!user) return null

    const completed = user.submissions.filter(s => s.status === 'APPROVED').length
    const pending = user.submissions.filter(s => s.status === 'PENDING').length

    return {
      reputation: user.reputation,
      completedMissions: completed,
      pendingReviews: pending,
      chosenArchetype: user.chosenArchetype
    }
  } catch (error) {
    console.error('Error fetching contributor stats:', error)
    return null
  }
}

export async function getProtocolForAdmin(address: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.address, address.toLowerCase())
    })
    
    if (!user) return null

    const adminRecord = await db.query.protocolAdmins.findFirst({
      where: eq(protocolAdmins.userId, user.id),
      with: {
        protocol: true
      }
    })

    return adminRecord?.protocol || null
  } catch (error) {
    console.error('Error fetching protocol for admin:', error)
    return null
  }
}
