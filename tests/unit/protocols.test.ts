import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProtocol, applyProtocol, approveProtocolApplication } from '@/actions/protocols'
import { db } from '@/db'
import { protocols, protocolApplications, users } from '@/db/schema'

// Mock the DB
vi.mock('@/db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: '123' }])
      }))
    })),
    query: {
      users: {
        findFirst: vi.fn()
      },
      protocolApplications: {
        findFirst: vi.fn()
      }
    },
    transaction: vi.fn(async (cb) => cb({
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(() => [{ id: '123' }])
        }))
      })),
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returning: vi.fn(() => [{ id: '123' }])
          }))
        }))
      })),
      query: {
        protocolApplications: {
          findFirst: vi.fn()
        }
      }
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          returning: vi.fn(() => [{ id: '123' }])
        }))
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn()
    }))
  }
}))

describe('Protocols Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createProtocol should insert a protocol and return success', async () => {
    const data = {
      name: 'Test Protocol',
      slug: 'test-protocol',
      description: 'A test protocol'
    }

    const result = await createProtocol(data)
    expect(result.success).toBe(true)
    expect(db.insert).toHaveBeenCalledWith(protocols)
  })

  it('applyProtocol should look up user and insert application', async () => {
    const data = {
      userId: '0xaddress',
      name: 'App Protocol',
      website: 'https://test.com',
      twitter: '@test',
      description: 'Desc'
    }

    // Mock user found
    ;(db.query.users.findFirst as any).mockResolvedValue({ id: 'uuid-123' })

    const result = await applyProtocol(data)
    expect(result.success).toBe(true)
    expect(db.query.users.findFirst).toHaveBeenCalled()
    // Verify it used the UUID not the address
    expect(db.insert).toHaveBeenCalledWith(protocolApplications)
  })

  it('applyProtocol should fail if user not found', async () => {
    const data = {
      userId: '0xunknown',
      name: 'App Protocol',
      website: 'https://test.com',
      twitter: '@test',
      description: 'Desc'
    }

    // Mock user not found
    ;(db.query.users.findFirst as any).mockResolvedValue(null)

    const result = await applyProtocol(data)
    expect(result.success).toBeUndefined()
    expect(result.error).toContain('User not found')
  })
})
