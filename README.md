# CountryVote Service API

A modern, scalable Node.js + Express + TypeScript backend API for voting on countries with detailed information from REST Countries API.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher (recommended: v20.x)
- **npm**: v9.x or higher

Check your versions:
```bash
node --version  # Should be v18.x or higher
npm --version   # Should be v9.x or higher
```

### Installation Steps

Follow these steps in order to set up and run the project:

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd countryVoteService
```

#### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Express, TypeScript, Sequelize
- Testing libraries (Jest, Supertest)
- Development tools (Nodemon, ts-node)

#### 3. Configure Environment Variables
Create a `.env` file in the root directory (optional):
```bash
PORT=3000
NODE_ENV=development
```

#### 4. Database Setup
The database will be automatically created on first run. SQLite database file: `database.sqlite`

**Optional:** Seed the database with all countries and mock votes:
```bash
npm run seed:up
```

To remove seeded data:
```bash
npm run seed:down
```

To check seeded data statistics:
```bash
npm run seed:stats
```

#### 5. Run the Development Server
```bash
npm run dev
```

Server starts at `http://localhost:3000`

#### 6. Verify Installation
Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-22T10:00:00.000Z"
}
```

### Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## ✨ Features

- ✅ **Create votes** with email validation and duplicate prevention
- ✅ **Get top 10 countries** with detailed information
- ✅ **Modular architecture** for easy scaling
- ✅ **Caching system** for external API calls (5min TTL)
- ✅ **Rate limiting** (100 requests/minute per IP)
- ✅ **Request logging** in development mode
- ✅ **TypeScript** with strict type safety
- ✅ **SQLite database** with Sequelize ORM
- ✅ **REST Countries API** integration

## 📋 API Endpoints

### Health Check

```bash
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-22T10:00:00.000Z"
}
```

### Create Vote

```bash
POST /api/votes
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@gmail.com",
  "country": "US"
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Required, valid email format
- `country`: Required, 2-3 letter ISO country code (Alpha-2 or Alpha-3)

**Success Response (201):**
```json
{
  "success": true,
  "message": "Vote created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@gmail.com",
    "country": "US",
    "createdAt": "2025-11-22T10:00:00.000Z"
  }
}
```

**Error Response - Duplicate Email (409):**
```json
{
  "success": false,
  "error": {
    "message": "This email has already been used to vote"
  }
}
```

### Get Top Countries

```bash
GET /api/countries/top?limit=10
```

**Query Parameters:**
- `limit`: Optional, default 10, max 50

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "name": "United States",
      "officialName": "United States of America",
      "capital": ["Washington, D.C."],
      "region": "Americas",
      "subRegion": "North America",
      "votes": 15
    }
  ]
}
```

## 🏗️ Architecture

### Modular Structure

```
src/
├── modules/                      # Feature modules
│   ├── votes/                    # Vote management
│   │   ├── vote.model.ts
│   │   ├── vote.service.ts
│   │   ├── vote.controller.ts
│   │   ├── vote.routes.ts
│   │   ├── vote.types.ts
│   │   ├── vote.validation.ts
│   │   └── index.ts
│   │
│   ├── countries/                # Country aggregation
│   │   ├── country.service.ts
│   │   ├── country.controller.ts
│   │   ├── country.routes.ts
│   │   ├── country.types.ts
│   │   └── index.ts
│   │
│   ├── shared/                   # Shared utilities
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   │   ├── validation.ts
│   │   │   ├── requestLogger.ts
│   │   │   └── rateLimit.ts
│   │   ├── interfaces/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── cache/
│   │   └── container/
│   │
│   └── index.ts                  # Module registry
│
├── config/                       # Configuration
│   ├── config.ts
│   └── database.ts
│
├── app.ts                        # Express app
└── server.ts                     # Server entry
```

### Key Design Patterns

- **Modular Architecture**: Feature-based organization for scalability
- **Dependency Injection**: Simple DI container for service management
- **Caching Strategy**: In-memory cache with TTL for external APIs
- **Error Handling**: Centralized error handling with custom AppError class
- **Validation**: express-validator with reusable middleware

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js v4.18.2 |
| **Language** | TypeScript v5.3.3 |
| **Database** | SQLite + Sequelize v6.35.0 |
| **Validation** | express-validator v7.0.1 |
| **HTTP Client** | axios v1.6.2 |
| **External API** | REST Countries API |

## 📦 Installation & Setup

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Environment Variables

Create a `.env` file (already provided with defaults):

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=http://localhost:4000
REST_COUNTRIES_API=https://restcountries.com/v3.1
```

### Available Scripts

```bash
npm run dev      # Development with auto-reload
npm run build    # Compile TypeScript
npm start        # Run production build
```

## 📊 Database Schema

### Votes Table

| Column    | Type      | Constraints           |
|-----------|-----------|-----------------------|
| id        | INTEGER   | PRIMARY KEY, AUTO INCREMENT |
| name      | STRING    | NOT NULL              |
| email     | STRING    | NOT NULL, UNIQUE      |
| country   | STRING    | NOT NULL, 2-3 chars   |
| createdAt | DATETIME  | AUTO                  |
| updatedAt | DATETIME  | AUTO                  |

**Indexes:**
- Unique index on `email`
- Index on `country` for faster aggregation

## 🔒 Security & Performance

### Rate Limiting
- **Default**: 100 requests per minute per IP
- **Protection**: Against brute force and abuse
- **Configurable**: Adjust in `shared/middleware/rateLimit.ts`

### Caching
- **Strategy**: In-memory cache with TTL
- **Duration**: 5 minutes for country data
- **Benefit**: Reduces external API calls by ~99%

### CORS
- **Enabled**: For `http://localhost:4000` (configurable via `.env`)
- **Methods**: GET, POST, PUT, DELETE
- **Headers**: Content-Type, Authorization

### Validation
- **Email**: RFC 5322 format validation
- **Country Code**: ISO Alpha-2/Alpha-3 validation
- **Sanitization**: Trim and normalize all inputs

## 🧪 Testing

### Using cURL

```bash
# Create a vote
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@gmail.com","country":"US"}'

# Get top countries
curl http://localhost:3000/api/countries/top
```

### Using Postman/Insomnia

Import these endpoints:
- POST `http://localhost:3000/api/votes`
- GET `http://localhost:3000/api/countries/top`

### Common Country Codes

| Country | Code |
|---------|------|
| United States | US, USA |
| Germany | DE, DEU |
| France | FR, FRA |
| United Kingdom | GB, GBR |
| Japan | JP, JPN |
| Brazil | BR, BRA |
| Canada | CA, CAN |

## 🚨 Error Handling

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200  | OK | Successful GET requests |
| 201  | Created | Successful POST requests |
| 400  | Bad Request | Validation errors |
| 404  | Not Found | Invalid endpoints |
| 409  | Conflict | Duplicate email |
| 429  | Too Many Requests | Rate limit exceeded |
| 500  | Internal Server Error | Server errors |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### Validation Error Format

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 📖 Documentation

- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Complete API response examples
- **[MODULAR_ARCHITECTURE.md](./MODULAR_ARCHITECTURE.md)** - Architecture deep dive
- **[MODULES_README.md](./MODULES_README.md)** - Module-by-module guide
- **[ARCHITECTURAL_IMPROVEMENTS.md](./ARCHITECTURAL_IMPROVEMENTS.md)** - Improvements & best practices
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Migration from flat to modular structure
- **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Visual architecture guide

## 🔧 Troubleshooting

### Port Already in Use

Change port in `.env`:
```env
PORT=3001
```

### Database Issues

Delete and restart to reset:
```bash
rm database.sqlite
npm run dev
```

### Module Not Found

Reinstall dependencies:
```bash
npm install
```

## 🚀 Production Considerations

### Recommended Enhancements

1. **Database**: Switch to PostgreSQL/MySQL for production
2. **Logging**: Implement structured logging (Winston/Pino)
3. **Monitoring**: Add health checks and performance monitoring
4. **Testing**: Add unit and integration tests
5. **Security**: Add Helmet.js for security headers
6. **CI/CD**: Set up automated deployment pipeline
7. **API Versioning**: Implement `/api/v1` versioning
8. **Documentation**: Generate OpenAPI/Swagger docs

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=/var/data/database.sqlite
CORS_ORIGIN=https://yourdomain.com
```

## 📝 License

ISC

## 🤝 Contributing

This is a demonstration project showcasing modern Node.js architecture patterns with TypeScript, modular design, and production-ready features.

---

**Built with ❤️ using Node.js, Express, and TypeScript**
