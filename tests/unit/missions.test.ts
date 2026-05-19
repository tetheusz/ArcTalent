import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMission, submitMission, reviewSubmission } from '@/actions/missions'
import { db } from '@/db'
import { missions, submissions, reviews, users } from '@/db/schema'

// Mock the DB
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: '123' }])
      }))
    })),
    transaction: vi.fn(async (cb) => cb({
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(() => [{ id: '123' }])
        }))
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn(() => [{ id: '123', userId: 'user-123', rewardGranted: 100 }])
          }))
        }))
      }))
    }))
  }
}))

describe('Missions Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createMission should insert a mission', async () => {
    const data = {
      title: 'Mission 1',
      description: 'Desc',
      requirements: 'Reqs',
      category: 'Developer',
      difficulty: 'BEGINNER',
      reputationReward: 100,
      protocolId: 'proto-123'
    }

    const result = await createMission(data)
    expect(result.success).toBe(true)
    expect(db.insert).toHaveBeenCalledWith(missions)
  })

  it('submitMission should insert a submission', async () => {
    const data = {
      missionId: 'miss-123',
      userId: 'user-123',
      title: 'My Work',
      evidence: 'Evidence text',
      links: '[]'
    }

    const result = await submitMission(data)
    expect(result.success).toBe(true)
    expect(db.insert).toHaveBeenCalledWith(submissions)
  })

  it('reviewSubmission should award XP on approval', async () => {
    const data = {
      status: 'APPROVED' as const,
      feedback: 'Good job',
      qualityScore: 5,
      impactScore: 5,
      rewardGranted: 100
    }

    const result = await reviewSubmission('sub-123', 'rev-123', data)
    expect(result.success).toBe(true)
    expect(db.transaction).toHaveBeenCalled()
  })
})
