import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AppService } from './app.service.ts'

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Returns a greeting string' })
  @ApiResponse({
    status: 200,
    description: 'Greeting message',
    schema: { $ref: '#/components/schemas/Greeting' },
  })
  getHello(): string {
    return this.appService.getHello()
  }
}
