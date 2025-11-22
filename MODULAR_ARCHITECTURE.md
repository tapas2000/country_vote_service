# Modular Architecture Guide

## Overview

The CountryVote Service now uses a **modular architecture** that organizes code by feature/domain, making it highly scalable and maintainable. Each module is self-contained with its own models, services, controllers, routes, and types.

## Module Structure

```
src/
├── modules/
│   ├── index.ts                    # Module registry & exports
│   ├── votes/                      # Votes module
│   │   ├── index.ts               # Module exports
│   │   ├── vote.model.ts          # Database model
│   │   ├── vote.service.ts        # Business logic
│   │   ├── vote.controller.ts     # Request handlers
│   │   ├── vote.routes.ts         # Route definitions
│   │   ├── vote.types.ts          # TypeScript interfaces
│   │   └── vote.validation.ts     # Input validation
│   ├── countries/                  # Countries module
│   │   ├── index.ts               # Module exports
│   │   ├── country.service.ts     # Business logic
│   │   ├── country.controller.ts  # Request handlers
│   │   ├── country.routes.ts      # Route definitions
│   │   └── country.types.ts       # TypeScript interfaces
│   └── shared/                     # Shared utilities
│       ├── index.ts               # Shared exports
│       └── middleware/            # Common middleware
│           ├── errorHandler.ts
│           └── validation.ts
├── config/                         # Configuration
│   ├── config.ts
│   └── database.ts
├── app.ts                          # Express app setup
└── server.ts                       # Server entry point
```

## Module Pattern

Each module follows this structure:

```
module-name/
├── index.ts                  # Barrel export file
├── module-name.model.ts      # Data model (if needed)
├── module-name.service.ts    # Business logic
├── module-name.controller.ts # HTTP handlers
├── module-name.routes.ts     # Route definitions
├── module-name.types.ts      # TypeScript types/interfaces
└── module-name.validation.ts # Validation rules (if needed)
```

### File Responsibilities

#### `index.ts` (Barrel Export)
Exports all public APIs from the module:
```typescript
export * from './module-name.model';
export * from './module-name.service';
export * from './module-name.controller';
export * from './module-name.routes';
export * from './module-name.types';
```

#### `*.types.ts`
TypeScript interfaces and types:
```typescript
export interface CreateDto {
  // DTO fields
}

export interface ResponseDto {
  // Response fields
}
```

#### `*.service.ts`
Business logic layer:
```typescript
export class ModuleService {
  async operation() {
    // Business logic
  }
}
```

#### `*.controller.ts`
HTTP request/response handlers:
```typescript
export class ModuleController {
  private service: ModuleService;

  operation = async (req, res, next) => {
    // Handle request
  };
}
```

#### `*.routes.ts`
Express route definitions:
```typescript
const router = Router();
const controller = new ModuleController();

router.get('/path', controller.operation);

export default router;
```

## Module Registry

The `src/modules/index.ts` file acts as the central registry:

```typescript
import voteRoutes from './votes/vote.routes';
import countryRoutes from './countries/country.routes';

export const registerModules = (): Router => {
  const router = Router();
  
  router.use('/', voteRoutes);
  router.use('/', countryRoutes);
  
  return router;
};
```

## Adding a New Module

### Step 1: Create Module Directory

```bash
mkdir -p src/modules/new-module
```

### Step 2: Create Module Files

**`new-module.types.ts`**
```typescript
export interface CreateNewModuleDto {
  field: string;
}

export interface NewModuleResponse {
  id: number;
  field: string;
}
```

**`new-module.service.ts`**
```typescript
import { AppError } from '../shared';

export class NewModuleService {
  async create(data: CreateNewModuleDto): Promise<NewModuleResponse> {
    // Implementation
  }
}
```

**`new-module.controller.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import { NewModuleService } from './new-module.service';

export class NewModuleController {
  private service: NewModuleService;

  constructor() {
    this.service = new NewModuleService();
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
```

**`new-module.routes.ts`**
```typescript
import { Router } from 'express';
import { NewModuleController } from './new-module.controller';

const router = Router();
const controller = new NewModuleController();

router.post('/new-module', controller.create);

export default router;
```

**`index.ts`**
```typescript
export * from './new-module.service';
export * from './new-module.controller';
export * from './new-module.routes';
export * from './new-module.types';
```

### Step 3: Register Module

Update `src/modules/index.ts`:

```typescript
import newModuleRoutes from './new-module/new-module.routes';

export const registerModules = (): Router => {
  const router = Router();
  
  router.use('/', voteRoutes);
  router.use('/', countryRoutes);
  router.use('/', newModuleRoutes);  // Add here
  
  return router;
};

export * from './new-module';  // Export module
```

## Current Modules

### 1. Votes Module (`/modules/votes`)

**Purpose:** Handle vote creation and vote-related operations

**Endpoints:**
- `POST /api/votes` - Create a vote
- `GET /api/votes/total` - Get total vote count

**Components:**
- `Vote` model - Sequelize model for votes table
- `VoteService` - Vote business logic
- `VoteController` - Vote HTTP handlers
- `validateVote` - Vote validation middleware

**Usage:**
```typescript
import { VoteService, CreateVoteDto } from './modules/votes';

const voteService = new VoteService();
const vote = await voteService.createVote(data);
```

### 2. Countries Module (`/modules/countries`)

**Purpose:** Handle country data and aggregation

**Endpoints:**
- `GET /api/countries/top?limit=10` - Get top countries
- `GET /api/countries/:code` - Get country by code

**Components:**
- `CountryService` - Country business logic with REST API integration
- `CountryController` - Country HTTP handlers

**Usage:**
```typescript
import { CountryService } from './modules/countries';

const countryService = new CountryService();
const topCountries = await countryService.getTopCountries(10);
```

### 3. Shared Module (`/modules/shared`)

**Purpose:** Common utilities and middleware

**Components:**
- `errorHandler` - Global error handling
- `notFoundHandler` - 404 handler
- `AppError` - Custom error class
- `validateVote` - Common validations

**Usage:**
```typescript
import { AppError, errorHandler } from './modules/shared';

throw new AppError('Something went wrong', 400);
```

## Benefits of Modular Architecture

### 1. **Scalability**
- Easy to add new modules without affecting existing ones
- Each module can be scaled independently
- Clear boundaries between features

### 2. **Maintainability**
- Related code is grouped together
- Easy to locate and fix bugs
- Reduced cognitive load

### 3. **Reusability**
- Modules can be reused across projects
- Services can be imported and used anywhere
- Clear public APIs via barrel exports

### 4. **Testing**
- Each module can be tested in isolation
- Mock dependencies easily
- Clear test boundaries

### 5. **Team Collaboration**
- Different teams can work on different modules
- Reduced merge conflicts
- Clear ownership

### 6. **Code Organization**
- Feature-based organization is intuitive
- New developers can understand structure quickly
- Consistent patterns across modules

## Module Communication

Modules can communicate through:

### 1. **Direct Service Import**
```typescript
import { VoteService } from '../votes';

export class CountryService {
  private voteService: VoteService;
  
  constructor() {
    this.voteService = new VoteService();
  }
}
```

### 2. **Shared Events** (Future Enhancement)
```typescript
import { EventEmitter } from 'events';

export const moduleEvents = new EventEmitter();

// In votes module
moduleEvents.emit('vote.created', voteData);

// In countries module
moduleEvents.on('vote.created', (data) => {
  // Handle event
});
```

### 3. **Shared Types**
```typescript
// modules/votes/vote.types.ts
export interface Vote {
  id: number;
  country: string;
}

// modules/countries/country.service.ts
import { Vote } from '../votes';
```

## Best Practices

### 1. **Keep Modules Focused**
Each module should have a single responsibility and clear purpose.

### 2. **Use Barrel Exports**
Always export public APIs through `index.ts` files.

### 3. **Minimize Cross-Module Dependencies**
Modules should be as independent as possible.

### 4. **Use TypeScript Interfaces**
Define clear contracts between modules using interfaces.

### 5. **Follow Naming Conventions**
- Models: `entity.model.ts`
- Services: `entity.service.ts`
- Controllers: `entity.controller.ts`
- Routes: `entity.routes.ts`
- Types: `entity.types.ts`

### 6. **Keep Shared Code Minimal**
Only put truly common code in the shared module.

### 7. **Document Module APIs**
Add JSDoc comments to public methods:
```typescript
/**
 * Creates a new vote
 * @param data - Vote creation data
 * @returns Created vote
 * @throws AppError if email already exists
 */
async createVote(data: CreateVoteDto): Promise<VoteResponse>
```

## Migration from Old Structure

The old flat structure has been reorganized into modules:

**Old:**
```
src/
├── controllers/
├── services/
├── models/
├── routes/
└── middleware/
```

**New:**
```
src/
└── modules/
    ├── votes/
    ├── countries/
    └── shared/
```

**Benefits:**
- Related files are now grouped together
- Easier to find and modify code
- Clear module boundaries
- Better code organization

## Future Enhancements

### 1. **Dependency Injection**
Implement a DI container for better testability:
```typescript
const container = new Container();
container.register('VoteService', VoteService);
```

### 2. **Module Configuration**
Per-module configuration:
```typescript
export const voteModuleConfig = {
  maxVotesPerDay: 1,
  allowedCountries: ['US', 'CA', 'MX']
};
```

### 3. **Module Lifecycle Hooks**
```typescript
export class VoteModule {
  async onInit() {
    // Initialize module
  }
  
  async onDestroy() {
    // Cleanup
  }
}
```

### 4. **Lazy Loading**
Load modules on demand:
```typescript
const voteModule = await import('./modules/votes');
```

### 5. **Module Versioning**
Support multiple versions of the same module:
```typescript
import { VoteService as VoteServiceV1 } from './modules/votes/v1';
import { VoteService as VoteServiceV2 } from './modules/votes/v2';
```

## Example: Adding Analytics Module

Here's a complete example of adding a new analytics module:

```typescript
// modules/analytics/analytics.types.ts
export interface AnalyticsData {
  totalVotes: number;
  topCountry: string;
  votesPerDay: number;
}

// modules/analytics/analytics.service.ts
import { VoteService } from '../votes';

export class AnalyticsService {
  private voteService: VoteService;

  constructor() {
    this.voteService = new VoteService();
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const total = await this.voteService.getTotalVotes();
    const counts = await this.voteService.getVoteCountByCountry();
    
    return {
      totalVotes: total,
      topCountry: counts[0]?.country || 'N/A',
      votesPerDay: 0 // Calculate
    };
  }
}

// modules/analytics/analytics.controller.ts
export class AnalyticsController {
  private service: AnalyticsService;

  constructor() {
    this.service = new AnalyticsService();
  }

  getAnalytics = async (req, res, next) => {
    try {
      const data = await this.service.getAnalytics();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
}

// modules/analytics/analytics.routes.ts
const router = Router();
const controller = new AnalyticsController();

router.get('/analytics', controller.getAnalytics);

export default router;

// modules/analytics/index.ts
export * from './analytics.service';
export * from './analytics.controller';
export * from './analytics.types';
export { default as analyticsRoutes } from './analytics.routes';

// Register in modules/index.ts
import analyticsRoutes from './analytics/analytics.routes';

router.use('/', analyticsRoutes);
```

## Conclusion

The modular architecture provides a scalable, maintainable foundation for the CountryVote Service. Each module is self-contained and can be developed, tested, and deployed independently. This structure supports rapid feature development while maintaining code quality and organization.
