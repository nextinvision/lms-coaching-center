# API Documentation

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token stored in HTTP-only cookie `auth_token`.

### Headers

```
Content-Type: application/json
X-CSRF-Token: <csrf-token> (required for POST/PUT/PATCH/DELETE)
```

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes
- **API endpoints**: 60 requests per minute
- **Upload endpoints**: 10 requests per minute

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Only in development
}
```

## Endpoints

### Authentication

#### POST /api/auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token",
    "expiresAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST /api/auth/logout
Logout user

**Response:**
```json
{
  "success": true
}
```

#### GET /api/auth/me
Get current user

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "STUDENT",
    ...
  }
}
```

### Students

#### GET /api/students
Get all students (Admin/Teacher only)

**Query Parameters:**
- `batchId` (optional): Filter by batch
- `search` (optional): Search by name/email
- `isActive` (optional): Filter by active status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### POST /api/students
Create student (Admin only)

**Request:**
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "phone": "1234567890",
  "password": "password123",
  "batchId": "batch-id"
}
```

#### GET /api/students/[id]
Get student by ID

#### PATCH /api/students/[id]
Update student (Admin only)

#### DELETE /api/students/[id]
Delete student (Admin only)

### Batches

#### GET /api/batches
Get all batches

#### POST /api/batches
Create batch (Admin only)

#### GET /api/batches/[id]
Get batch by ID

#### PATCH /api/batches/[id]
Update batch (Admin only)

#### DELETE /api/batches/[id]
Delete batch (Admin only)

### Content

#### GET /api/content
Get all content

**Query Parameters:**
- `batchId` (optional): Filter by batch
- `subjectId` (optional): Filter by subject
- `type` (optional): Filter by type (PDF/IMAGE/VIDEO)

#### POST /api/content
Create content (Teacher only)

#### GET /api/content/[id]
Get content by ID

#### POST /api/content/upload/pdf
Upload PDF file

**Request:** `multipart/form-data`
- `file`: PDF file
- `batchId`: Batch ID
- `subjectId`: Subject ID
- `chapterName`: Chapter name

#### POST /api/content/upload/image
Upload image file

**Request:** `multipart/form-data`
- `file`: Image file
- `batchId`: Batch ID
- `subjectId`: Subject ID
- `chapterName`: Chapter name

### Tests

#### GET /api/tests
Get all tests

#### POST /api/tests
Create test (Teacher only)

#### GET /api/tests/[id]
Get test by ID

#### POST /api/tests/[id]/submit
Submit test (Student only)

#### GET /api/tests/[id]/results
Get test results (Teacher/Admin only)

### Attendance

#### GET /api/attendance
Get attendance records

#### POST /api/attendance
Mark attendance (Teacher/Admin only)

#### GET /api/attendance/student/[studentId]
Get student attendance history

#### GET /api/attendance/batch/[batchId]
Get batch attendance

### Homework

#### GET /api/homework
Get all homework assignments

#### POST /api/homework
Create homework (Teacher only)

#### GET /api/homework/[id]
Get homework by ID

#### POST /api/homework/[id]/submit
Submit homework (Student only)

#### GET /api/homework/[id]/submissions
Get homework submissions (Teacher only)

### Notices

#### GET /api/notices
Get all notices

#### POST /api/notices
Create notice (Admin only)

#### GET /api/notices/[id]
Get notice by ID

### Reports

#### GET /api/reports/attendance
Get attendance report

**Query Parameters:**
- `batchId` (optional)
- `studentId` (optional)
- `startDate` (optional)
- `endDate` (optional)

#### GET /api/reports/performance
Get performance report

#### GET /api/reports/stats
Get report statistics

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Pagination

All list endpoints support pagination:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Response includes pagination metadata.

## Filtering

Most list endpoints support filtering via query parameters. Check individual endpoint documentation for available filters.

## Sorting

Sorting is available via `orderBy` query parameter:

```
?orderBy=createdAt:desc
?orderBy=name:asc
```

