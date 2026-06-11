import type { User } from '@monorepo-template/contracts'
import { Test, type TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, rs } from '@rstest/core'
import { DB_TOKEN } from '../database/database.module.ts'
import { UsersService } from './users.service.ts'

const dbRow = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'alice@example.com',
  name: 'Alice',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
}

const contractUser: User = {
  id: dbRow.id,
  email: dbRow.email,
  name: dbRow.name,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

describe('UsersService', () => {
  let service: UsersService
  let mockLimit: ReturnType<typeof rs.fn>
  let mockWhere: ReturnType<typeof rs.fn>
  let mockFrom: ReturnType<typeof rs.fn>

  beforeEach(async () => {
    mockLimit = rs.fn()
    mockWhere = rs.fn().mockReturnValue({ limit: mockLimit })
    mockFrom = rs.fn().mockReturnValue({ where: mockWhere })
    const mockDb = { select: rs.fn().mockReturnValue({ from: mockFrom }) }

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: DB_TOKEN, useValue: mockDb }],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  describe('findAll', () => {
    it('returns mapped users', async () => {
      mockFrom.mockResolvedValue([dbRow])
      expect(await service.findAll()).toEqual([contractUser])
    })

    it('returns empty array when no users', async () => {
      mockFrom.mockResolvedValue([])
      expect(await service.findAll()).toEqual([])
    })
  })

  describe('findOne', () => {
    it('returns user when found', async () => {
      mockLimit.mockResolvedValue([dbRow])
      expect(await service.findOne(dbRow.id)).toEqual(contractUser)
    })

    it('returns null when not found', async () => {
      mockLimit.mockResolvedValue([])
      expect(await service.findOne('nonexistent')).toBeNull()
    })
  })
})
