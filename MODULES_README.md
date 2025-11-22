# Modular Structure - Quick Reference

## 📁 New Project Structure

```
src/
├── modules/                    # Feature modules
│   ├── votes/                 # Votes module
│   │   ├── vote.model.ts
│   │   ├── vote.service.ts
│   │   ├── vote.controller.ts
│   │   ├── vote.routes.ts
│   │   ├── vote.types.ts
│   │   ├── vote.validation.ts
│   │   └── index.ts           # Exports
│   ├── countries/             # Countries module
│   │   ├── country.service.ts
│   │   ├── country.controller.ts
│   │   ├── country.routes.ts
│   │   ├── country.types.ts
│   │   └── index.ts           # Exports
│   ├── shared/                # Shared utilities
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   └── index.ts           # Exports
│   └── index.ts               # Module registry
├── config/
│   ├── config.ts
│   └── database.ts
├── app.ts                      # App setup
└── server.ts                   # Entry point
```

## 🎯 Key Improvements

### Before (Flat Structure)
```
src/
├── controllers/
│   ├── voteController.ts
│   └── countryController.ts
├── services/
│   ├── voteService.ts
│   └── countryService.ts
├── models/
│   └── Vote.ts
├── routes/
│   ├── voteRoutes.ts
│   └── countryRoutes.ts
└── middleware/
```

**Problems:**
- Hard to see which files belong together
- Difficult to add new features
- No clear boundaries
- Related code scattered across folders

### After (Modular Structure)
```
src/
└── modules/
    ├── votes/          # Everything vote-related in one place
    ├── countries/      # Everything country-related in one place
    └── shared/         # Common utilities
```

**Benefits:**
- ✅ Related files grouped together
- ✅ Easy to add new modules
- ✅ Clear boundaries
- ✅ Better organization
- ✅ Scalable architecture

## 🚀 Adding a New Module (Example: Users)

### 1. Create the module structure:
```bash
mkdir -p src/modules/users
```

### 2. Create files:

**`users/user.types.ts`**
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}
```

**`users/user.service.ts`**
```typescript
export class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    // Implementation
  }
}
```

**`users/user.controller.ts`**
```typescript
export class UserController {
  private service = new UserService();

  createUser = async (req, res, next) => {
    // Handle request
  };
}
```

**`users/user.routes.ts`**
```typescript
import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();
const controller = new UserController();

router.post('/users', controller.createUser);

export default router;
```

**`users/index.ts`**
```typescript
export * from './user.service';
export * from './user.controller';
export * from './user.types';
export { default as userRoutes } from './user.routes';
```

### 3. Register in `modules/index.ts`:
```typescript
import userRoutes from './users/user.routes';

export const registerModules = (): Router => {
  const router = Router();
  
  router.use('/', voteRoutes);
  router.use('/', countryRoutes);
  router.use('/', userRoutes);  // Add new module
  
  return router;
};

export * from './users';  // Export module
```

Done! Your new module is ready to use.

## 📦 Module Exports

Each module exports its public API through `index.ts`:

```typescript
// Import from module
import { VoteService, CreateVoteDto } from './modules/votes';

// Use it
const voteService = new VoteService();
```

## 🔄 Module Communication

Modules can use each other's services:

```typescript
// In countries module
import { VoteService } from '../votes';

export class CountryService {
  private voteService = new VoteService();
  
  async getTopCountries() {
    const votes = await this.voteService.getVoteCountByCountry();
    // Use votes data
  }
}
```

## 🎨 Module Pattern

Each module follows this pattern:

```
module-name/
├── module-name.model.ts      # Database model (optional)
├── module-name.service.ts    # Business logic
├── module-name.controller.ts # HTTP handlers
├── module-name.routes.ts     # Route definitions
├── module-name.types.ts      # TypeScript types
├── module-name.validation.ts # Validation (optional)
└── index.ts                  # Public exports
```

## 🛠️ Current Modules

### Votes Module
- **Location:** `src/modules/votes/`
- **Endpoints:** 
  - `POST /api/votes` - Create vote
  - `GET /api/votes/total` - Get total votes
- **Exports:** `VoteService`, `VoteController`, `Vote`, `CreateVoteDto`

### Countries Module
- **Location:** `src/modules/countries/`
- **Endpoints:**
  - `GET /api/countries/top?limit=10` - Top countries
  - `GET /api/countries/:code` - Country by code
- **Exports:** `CountryService`, `CountryController`, `CountryDetails`

### Shared Module
- **Location:** `src/modules/shared/`
- **Exports:** `AppError`, `errorHandler`, `notFoundHandler`

## 📚 Documentation

- **MODULAR_ARCHITECTURE.md** - Complete guide to the modular architecture
- **README.md** - General documentation
- **QUICKSTART.md** - Quick start guide

## 🎯 Benefits

1. **Easy to Navigate** - Find everything related to a feature in one place
2. **Easy to Scale** - Add new modules without touching existing code
3. **Easy to Test** - Test modules in isolation
4. **Easy to Maintain** - Clear boundaries and responsibilities
5. **Easy to Collaborate** - Different teams can work on different modules

## 🔍 Finding Code

**Before:** "Where is the vote creation logic?"
- Check controllers folder
- Check services folder
- Check routes folder
- Check models folder

**After:** "Where is the vote creation logic?"
- Go to `modules/votes/` - everything is there!

## ✨ Migration Notes

The old structure still exists in:
- `src/controllers/` (deprecated)
- `src/services/` (deprecated)
- `src/models/` (deprecated)
- `src/routes/` (deprecated)
- `src/middleware/` (deprecated)

These can be removed once you're comfortable with the new structure.

The app now uses the modular structure from `src/modules/`.

## 🎓 Learn More

For detailed information, see **MODULAR_ARCHITECTURE.md**
