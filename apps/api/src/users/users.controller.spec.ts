import type { User } from '@monorepo-template/contracts'
import { NotFoundException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, rs } from '@rstest/core'
import { UsersController } from './users.controller.ts'
import { UsersService } from './users.service.ts'

const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'alice@example.com',
  name: 'Alice',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

describe('UsersController', () => {
  let controller: UsersController
  let mockService: { findAll: ReturnType<typeof rs.fn>; findOne: ReturnType<typeof rs.fn> }

  beforeEach(async () => {
    mockService = {
      findAll: rs.fn().mockResolvedValue([mockUser]),
      findOne: rs.fn().mockResolvedValue(mockUser),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  describe('findAll', () => {
    it('returns user list from service', async () => {
      expect(await controller.findAll()).toEqual([mockUser])
    })
  })

  describe('findOne', () => {
    it('returns user when found', async () => {
      expect(await controller.findOne(mockUser.id)).toEqual(mockUser)
    })

    it('throws NotFoundException when user does not exist', async () => {
      mockService.findOne.mockResolvedValue(null)
      await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException)
    })
  })
})
