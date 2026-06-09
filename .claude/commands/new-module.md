Create a new NestJS module with controller, service, and unit tests.

Usage: /new-module <name>
Example: /new-module users

Creates:
- `apps/api/src/<name>/<name>.module.ts`
- `apps/api/src/<name>/<name>.controller.ts`
- `apps/api/src/<name>/<name>.service.ts`
- `apps/api/src/<name>/<name>.controller.spec.ts`

Pattern (replace Name with PascalCase, name with camelCase):

module.ts:
```ts
import { Module } from '@nestjs/common'
import { NameController } from './name.controller.ts'
import { NameService } from './name.service.ts'

@Module({ controllers: [NameController], providers: [NameService] })
export class NameModule {}
```

controller.ts:
```ts
import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { NameService } from './name.service.ts'

@ApiTags('name')
@Controller('name')
export class NameController {
  constructor(private readonly nameService: NameService) {}

  @Get()
  findAll() {
    return this.nameService.findAll()
  }
}
```

service.ts:
```ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class NameService {
  findAll(): unknown[] {
    return []
  }
}
```

Then import the module in `apps/api/src/app.module.ts`.
Run: `pnpm --filter @monorepo-template/api test:unit`
Commit: `feat(api): add name module`
