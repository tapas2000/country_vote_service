# API Response Examples

This document shows real examples of API responses from the CountryVote Service.

## 1. Health Check

**Request:**
```bash
GET /health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-22T10:30:45.123Z"
}
```

---

## 2. Create Vote - Success

**Request:**
```bash
POST /api/votes
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "country": "US"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Vote created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "country": "US",
    "createdAt": "2025-11-22T10:31:00.000Z"
  }
}
```

---

## 3. Create Vote - Duplicate Email

**Request:**
```bash
POST /api/votes
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "john@example.com",
  "country": "CA"
}
```

**Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "message": "This email has already been used to vote"
  }
}
```

---

## 4. Create Vote - Invalid Email

**Request:**
```bash
POST /api/votes
Content-Type: application/json

{
  "name": "Test User",
  "email": "not-an-email",
  "country": "US"
}
```

**Response (400 Bad Request):**
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

---

## 5. Create Vote - Missing Fields

**Request:**
```bash
POST /api/votes
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "country",
      "message": "Country code is required"
    }
  ]
}
```

---

## 6. Create Vote - Invalid Country Code

**Request:**
```bash
POST /api/votes
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "country": "TOOLONG"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "country",
      "message": "Country code must be 2-3 characters"
    }
  ]
}
```

---

## 7. Get Top Countries - With Data

**Request:**
```bash
GET /api/countries/top
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "name": "Germany",
      "officialName": "Federal Republic of Germany",
      "capital": [
        "Berlin"
      ],
      "region": "Europe",
      "subRegion": "Western Europe",
      "votes": 5
    },
    {
      "name": "United States",
      "officialName": "United States of America",
      "capital": [
        "Washington, D.C."
      ],
      "region": "Americas",
      "subRegion": "North America",
      "votes": 3
    },
    {
      "name": "France",
      "officialName": "French Republic",
      "capital": [
        "Paris"
      ],
      "region": "Europe",
      "subRegion": "Western Europe",
      "votes": 2
    },
    {
      "name": "Spain",
      "officialName": "Kingdom of Spain",
      "capital": [
        "Madrid"
      ],
      "region": "Europe",
      "subRegion": "Southern Europe",
      "votes": 1
    }
  ]
}
```

---

## 8. Get Top Countries - Empty Database

**Request:**
```bash
GET /api/countries/top
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": []
}
```

---

## 9. Invalid Route

**Request:**
```bash
GET /api/invalid-endpoint
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "message": "Route /api/invalid-endpoint not found"
  }
}
```

---

## 10. Server Error Example

**Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": {
    "message": "Failed to create vote"
  }
}
```

In development mode, this will also include a stack trace:
```json
{
  "success": false,
  "error": {
    "message": "Failed to create vote",
    "stack": "Error: Failed to create vote\n    at VoteService.createVote..."
  }
}
```

---

## Response Structure

All API responses follow a consistent structure:

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": { /* Response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "errors": [
    {
      "field": "field_name",
      "message": "Validation error message"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200  | OK | Successful GET requests |
| 201  | Created | Successful POST requests |
| 400  | Bad Request | Validation errors |
| 404  | Not Found | Invalid endpoints |
| 409  | Conflict | Duplicate email |
| 500  | Internal Server Error | Server errors |

---

## Testing Tips

1. **Use JSON formatting tools** to make responses readable
2. **Check HTTP status codes** to understand the response type
3. **Validate country codes** using ISO Alpha-2 or Alpha-3 format
4. **Test edge cases** like empty strings, special characters, etc.
5. **Try multiple votes** to see aggregation in action

---

## Common Country Codes for Testing

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
| India | IN | IND |
| China | CN | CHN |
| Spain | ES | ESP |
| Italy | IT | ITA |
| Mexico | MX | MEX |
| South Korea | KR | KOR |
| Netherlands | NL | NLD |
