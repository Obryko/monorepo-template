import type { User, UserList } from '@monorepo-template/contracts'
import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service.ts'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: { $ref: '#/components/schemas/UserList' },
  })
  findAll(): Promise<UserList> {
    return this.usersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User', schema: { $ref: '#/components/schemas/User' } })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id)
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }
}
