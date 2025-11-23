# Postman Collection Guide

## Import to Postman

1. **Open Postman**
2. **Click "Import"** button (top left)
3. **Select** `postman_collection.json` from this directory
4. **Done!** All endpoints are now available

## Quick cURL Commands

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Vote - United States
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "country": "US"
  }'
```

### Create Vote - Germany
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Schmidt",
    "email": "maria@gmail.com",
    "country": "DE"
  }'
```

### Create Vote - France
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pierre Dubois",
    "email": "pierre@gmail.com",
    "country": "FR"
  }'
```

### Create Vote - Japan
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yuki Tanaka",
    "email": "yuki@gmail.com",
    "country": "JP"
  }'
```

### Create Vote - Brazil (Alpha-3 Code)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carlos Silva",
    "email": "carlos@gmail.com",
    "country": "BRA"
  }'
```

### Create Vote - Canada
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "email": "sarah@gmail.com",
    "country": "CA"
  }'
```

### Create Vote - United Kingdom
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "James Smith",
    "email": "james@gmail.com",
    "country": "GB"
  }'
```

### Create Vote - Spain
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Garcia",
    "email": "ana@gmail.com",
    "country": "ES"
  }'
```

### Create Vote - Italy
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marco Rossi",
    "email": "marco@gmail.com",
    "country": "IT"
  }'
```

### Create Vote - Australia
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emma Watson",
    "email": "emma@gmail.com",
    "country": "AU"
  }'
```

### Get Top 10 Countries
```bash
curl http://localhost:3000/api/countries/top
```

### Get Top 5 Countries
```bash
curl http://localhost:3000/api/countries/top?limit=5
```

### Get Top 20 Countries
```bash
curl http://localhost:3000/api/countries/top?limit=20
```

## Test Error Scenarios

### Duplicate Email (409 Conflict)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "john@gmail.com",
    "country": "CA"
  }'
```

### Invalid Email (400 Bad Request)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "not-an-email",
    "country": "US"
  }'
```

### Missing Country Field (400 Bad Request)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@gmail.com"
  }'
```

### Invalid Country Code (400 Bad Request)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@gmail.com",
    "country": "TOOLONG"
  }'
```

### Empty Name (400 Bad Request)
```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "test3@gmail.com",
    "country": "US"
  }'
```

## Testing Workflow

### 1. Start the Server
```bash
npm run dev
```

### 2. Check Health
```bash
curl http://localhost:3000/health
```

### 3. Create Multiple Votes
Run the create vote commands above for different countries.

### 4. View Top Countries
```bash
curl http://localhost:3000/api/countries/top
```

### 5. Test Error Cases
Run the error scenario commands to see validation in action.

## Response Format

### Success Response
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

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "This email has already been used to vote"
  }
}
```

### Validation Error
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

## Country Codes Reference

| Country | Alpha-2 | Alpha-3 |
|---------|---------|---------|
| United States | US | USA |
| Germany | DE | DEU |
| France | FR | FRA |
| United Kingdom | GB | GBR |
| Japan | JP | JPN |
| Brazil | BR | BRA |
| Canada | CA | CAN |
| Australia | AU | AUS |
| Spain | ES | ESP |
| Italy | IT | ITA |
| India | IN | IND |
| China | CN | CHN |
| Mexico | MX | MEX |
| South Korea | KR | KOR |
| Netherlands | NL | NLD |

## Tips

1. **Use `-v` flag** with cURL to see full response headers:
   ```bash
   curl -v http://localhost:3000/health
   ```

2. **Pretty print JSON** with `jq`:
   ```bash
   curl http://localhost:3000/api/countries/top | jq
   ```

3. **Save responses** to file:
   ```bash
   curl http://localhost:3000/api/countries/top > top-countries.json
   ```

4. **Test rate limiting** by sending multiple requests quickly:
   ```bash
   for i in {1..110}; do curl http://localhost:3000/health; done
   ```

5. **Check response time**:
   ```bash
   curl -w "@-" -o /dev/null -s http://localhost:3000/api/countries/top <<'EOF'
   time_total: %{time_total}s
   EOF
   ```
