# Performance Optimization Implementation Plan

## Overview
This document outlines a comprehensive plan to address all identified bottlenecks in the LMS codebase for production readiness.

**Estimated Total Time:** 3-4 weeks
**Priority:** Critical for production scalability

---

## Phase 1: Critical Fixes (Week 1)
*These fixes address the most severe performance issues that will cause immediate problems in production.*

### 1.1 Add Pagination to All List Endpoints
**Priority:** 🔴 Critical  
**Estimated Time:** 2-3 days  
**Impact:** Prevents memory exhaustion and slow responses

#### Steps:
1. **Update Service Layer**
   - Modify all `getAll()` methods in services to accept pagination parameters
   - Add `skip`, `take`, and return `total` count
   - Update return types to include pagination metadata

2. **Update API Routes**
   - Parse pagination query params (`page`, `limit`) in all GET endpoints
   - Pass pagination to service methods
   - Return paginated response with metadata

3. **Update Frontend Hooks**
   - Modify hooks to handle paginated responses
   - Update components to use pagination controls

#### Files to Modify:
- `src/modules/students/services/studentService.ts`
- `src/modules/content/services/contentService.ts`
- `src/modules/tests/services/testService.ts`
- `src/modules/homework/services/homeworkService.ts`
- `src/modules/attendance/services/attendanceService.ts`
- `src/modules/batches/services/batchService.ts`
- `src/modules/teachers/services/teacherService.ts`
- `src/modules/notices/services/noticeService.ts`
- All corresponding API routes in `src/app/api/**/route.ts`
- Frontend hooks in `src/modules/*/hooks/`

#### Implementation Pattern:
```typescript
// Service method signature
async getAll(filters?: Filters, pagination?: PaginationParams): Promise<PaginatedResult<Entity>>

// API route pattern
const { page = 1, limit = 10 } = parsePaginationQuery(searchParams);
const result = await service.getAll(filters, { page, limit, skip: (page - 1) * limit });

// Response format
return NextResponse.json({
  success: true,
  data: result.data,
  pagination: {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit)
  }
});
```

---

### 1.2 Fix Batch Operations - Attendance Marking
**Priority:** 🔴 Critical  
**Estimated Time:** 1 day  
**Impact:** Reduces 100+ queries to 2-3 queries for attendance marking

#### Steps:
1. **Refactor `attendanceService.markAttendance()`**
   - Use Prisma's `createMany` and `updateMany` with proper upsert logic
   - Batch all operations into single transaction
   - Use `upsertMany` pattern or raw SQL for better performance

2. **Optimize Query Pattern**
   - Fetch existing attendance records in one query
   - Use `createMany` for new records
   - Use `updateMany` for existing records

#### Files to Modify:
- `src/modules/attendance/services/attendanceService.ts`

#### Implementation:
```typescript
async markAttendance(data: MarkAttendanceInput, markedById: string): Promise<Attendance[]> {
  // Fetch all existing attendance in one query
  const existingAttendances = await prisma.attendance.findMany({
    where: {
      batchId: data.batchId,
      date: data.date,
      studentId: { in: data.attendance.map(a => a.studentId) }
    }
  });

  const existingMap = new Map(existingAttendances.map(a => [a.studentId, a]));

  const toCreate = data.attendance.filter(a => !existingMap.has(a.studentId));
  const toUpdate = data.attendance.filter(a => existingMap.has(a.studentId));

  return prisma.$transaction(async (tx) => {
    // Bulk create new records
    if (toCreate.length > 0) {
      await tx.attendance.createMany({
        data: toCreate.map(att => ({
          studentId: att.studentId,
          batchId: data.batchId,
          date: data.date,
          present: att.present,
          remarks: att.remarks || null,
          markedById,
        }))
      });
    }

    // Bulk update existing records
    if (toUpdate.length > 0) {
      await Promise.all(
        toUpdate.map(att => {
          const existing = existingMap.get(att.studentId)!;
          return tx.attendance.update({
            where: { id: existing.id },
            data: {
              present: att.present,
              remarks: att.remarks || null,
              markedById,
            }
          });
        })
      );
    }

    // Return updated records
    return tx.attendance.findMany({
      where: {
        batchId: data.batchId,
        date: data.date,
        studentId: { in: data.attendance.map(a => a.studentId) }
      },
      include: {
        student: { include: { user: true } },
        batch: { include: { academicYear: true } }
      }
    });
  });
}
```

---

### 1.3 Add Query Result Limits
**Priority:** 🔴 Critical  
**Estimated Time:** 0.5 days  
**Impact:** Prevents fetching unlimited records

#### Steps:
1. **Add default limits to all `findMany` queries**
   - Set maximum `take` limit (e.g., 1000)
   - Add validation in query optimizer
   - Update `queryOptimizer.ts` to enforce limits

#### Files to Modify:
- `src/core/database/queryOptimizer.ts`
- All service `getAll()` methods

#### Implementation:
```typescript
// In queryOptimizer.ts
export function optimizeQuery<T extends QueryOptions>(options: T): T {
  const optimized: any = { ...options };
  
  // Enforce maximum limit
  const MAX_LIMIT = 1000;
  if (optimized.take && optimized.take > MAX_LIMIT) {
    optimized.take = MAX_LIMIT;
  }
  
  // Add default limit if not specified
  if (!optimized.take && !optimized.skip) {
    optimized.take = 100; // Default limit
  }
  
  return optimized as T;
}
```

---

## Phase 2: High Priority Fixes (Week 2)
*These fixes address significant performance issues and security concerns.*

### 2.1 Fix N+1 Query Problems
**Priority:** 🟠 High  
**Estimated Time:** 2 days  
**Impact:** Reduces database queries by 80-90% in affected areas

#### Steps:

**2.1.1 Fix `studentService.getStats()`**
- Use `groupBy` with proper includes
- Fetch batch details in single query with `whereIn`

**2.1.2 Fix `testService.getStats()`**
- Use database aggregations instead of fetching all records
- Calculate averages using SQL aggregations

**2.1.3 Fix `attendanceService.getMonthlyReport()`**
- Optimize date grouping with database functions
- Reduce redundant queries

#### Files to Modify:
- `src/modules/students/services/studentService.ts`
- `src/modules/tests/services/testService.ts`
- `src/modules/attendance/services/attendanceService.ts`

#### Implementation Example:
```typescript
// Before (N+1):
const batchDetails = await Promise.all(
  studentsByBatch.map(async (item) => {
    const batch = await prisma.batch.findUnique({ where: { id: item.batchId } });
    // ...
  })
);

// After (Single query):
const batchIds = studentsByBatch.map(item => item.batchId).filter(Boolean);
const batches = await prisma.batch.findMany({
  where: { id: { in: batchIds } }
});
const batchMap = new Map(batches.map(b => [b.id, b]));

const batchDetails = studentsByBatch.map(item => ({
  batchId: item.batchId || 'unassigned',
  batchName: batchMap.get(item.batchId!)?.name || 'Unassigned',
  count: item._count,
}));
```

---

### 2.2 Implement Rate Limiting
**Priority:** 🟠 High  
**Estimated Time:** 1 day  
**Impact:** Prevents API abuse and DDoS attacks

#### Steps:
1. **Apply rate limiting to all API routes**
   - Use `createApiHandler` wrapper or apply rate limiter middleware
   - Configure different limits for different endpoints
   - Add rate limit headers to responses

2. **Update API Routes**
   - Wrap all route handlers with rate limiting
   - Use appropriate rate limiters (auth, upload, general API)

#### Files to Modify:
- All files in `src/app/api/**/route.ts`
- Create wrapper utility if needed

#### Implementation:
```typescript
// Option 1: Use createApiHandler wrapper
import { createApiHandler } from '@/core/api/apiWrapper';

export const GET = createApiHandler(
  async (request: NextRequest) => {
    // Handler logic
  },
  {
    rateLimiter: apiRateLimiter,
    requireAuth: true,
  }
);

// Option 2: Apply rate limiting directly
import { rateLimit, apiRateLimiter } from '@/core/middleware/rateLimiter';

export async function GET(request: NextRequest) {
  const rateLimitResponse = rateLimit(apiRateLimiter, request);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Handler logic
}
```

---

### 2.3 Optimize Test Submission
**Priority:** 🟠 High  
**Estimated Time:** 0.5 days  
**Impact:** Faster test submissions for large tests

#### Steps:
1. **Refactor `testService.submitTest()`**
   - Use `createMany` for bulk answer creation
   - Calculate marks in single pass

#### Files to Modify:
- `src/modules/tests/services/testService.ts`

#### Implementation:
```typescript
// Replace loop with bulk insert
await prisma.answer.createMany({
  data: data.answers.map(answerData => {
    const question = test.questions.find(q => q.id === answerData.questionId);
    // ... calculate marks
    return {
      submissionId: submission.id,
      questionId: answerData.questionId,
      // ... other fields
    };
  })
});
```

---

## Phase 3: Medium Priority Fixes (Week 3)
*These fixes improve overall system performance and maintainability.*

### 3.1 Add Database Connection Pooling
**Priority:** 🟡 Medium  
**Estimated Time:** 0.5 days  
**Impact:** Better handling of concurrent requests

#### Steps:
1. **Configure Prisma connection pool**
   - Set appropriate pool size based on expected load
   - Configure connection timeout
   - Add connection pool monitoring

#### Files to Modify:
- `src/core/database/prisma.ts`
- `.env` file (add connection pool config)

#### Implementation:
```typescript
// In prisma.ts
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// In .env
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10&pool_timeout=20"
```

---

### 3.2 Implement Caching Strategy
**Priority:** 🟡 Medium  
**Estimated Time:** 2 days  
**Impact:** Reduces database load for frequently accessed data

#### Steps:
1. **Cache frequently accessed data**
   - User authentication (already partially done)
   - Batch lists
   - Subject lists
   - Academic year lists
   - Stats calculations

2. **Implement cache invalidation**
   - Invalidate on create/update/delete
   - Set appropriate TTLs

#### Files to Modify:
- `src/modules/batches/services/batchService.ts`
- `src/modules/subjects/services/subjectService.ts`
- `src/modules/academic-years/services/academicYearService.ts`
- Add cache decorators to service methods

#### Implementation:
```typescript
import { cached } from '@/core/utils/cache';

export const batchService = {
  getAll: cached(
    async (filters?: BatchFilters) => {
      // Original implementation
    },
    {
      ttl: 5 * 60 * 1000, // 5 minutes
      keyGenerator: (filters) => `batches:${JSON.stringify(filters)}`
    }
  ),
  
  // Invalidate cache on create/update/delete
  async create(data: CreateBatchInput) {
    const result = await prisma.batch.create({ /* ... */ });
    memoryCache.invalidate(/^batches:/); // Invalidate all batch caches
    return result;
  }
};
```

---

### 3.3 Optimize Stats Calculations
**Priority:** 🟡 Medium  
**Estimated Time:** 1 day  
**Impact:** Faster stats endpoints

#### Steps:
1. **Use database aggregations**
   - Replace multiple count queries with single aggregation
   - Use Prisma's `aggregate` and `groupBy`
   - Calculate averages in database

#### Files to Modify:
- `src/modules/students/services/studentService.ts`
- `src/modules/tests/services/testService.ts`
- `src/modules/attendance/services/attendanceService.ts`

#### Implementation:
```typescript
// Before: Multiple queries
const totalAttendance = await prisma.attendance.count({ where: { studentId: id } });
const presentAttendance = await prisma.attendance.count({ where: { studentId: id, present: true } });

// After: Single aggregation
const stats = await prisma.attendance.groupBy({
  by: ['present'],
  where: { studentId: id },
  _count: true,
});
```

---

### 3.4 Add Composite Database Indexes
**Priority:** 🟡 Medium  
**Estimated Time:** 1 day  
**Impact:** Faster queries on filtered/sorted data

#### Steps:
1. **Identify common query patterns**
   - Review all service methods for filter combinations
   - Add composite indexes for frequently used combinations

2. **Create migration**
   - Add indexes to Prisma schema
   - Generate and run migration

#### Files to Modify:
- `prisma/schema.prisma`

#### Implementation:
```prisma
model Attendance {
  // ... existing fields
  
  @@unique([studentId, batchId, date])
  @@index([batchId, date]) // Composite index for common query
  @@index([studentId, date]) // For student attendance queries
}

model Content {
  // ... existing fields
  
  @@index([batchId, subjectId, language]) // Common filter combination
  @@index([batchId, createdAt]) // For sorted lists
}

model Test {
  // ... existing fields
  
  @@index([batchId, isActive, createdAt]) // Common filter + sort
}
```

---

### 3.5 Automate Session Cleanup
**Priority:** 🟡 Medium  
**Estimated Time:** 0.5 days  
**Impact:** Prevents database bloat

#### Steps:
1. **Create scheduled cleanup job**
   - Use Next.js API route with cron trigger (Vercel Cron, or external service)
   - Or use database scheduled job (PostgreSQL pg_cron)
   - Run cleanup daily

#### Files to Create/Modify:
- `src/app/api/cron/cleanup-sessions/route.ts` (for Vercel Cron)
- Or configure database cron job

#### Implementation:
```typescript
// src/app/api/cron/cleanup-sessions/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/core/database/prisma';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete expired sessions
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });

  return NextResponse.json({ 
    success: true, 
    deleted: result.count 
  });
}
```

---

### 3.6 Add File Upload Size Limits
**Priority:** 🟡 Medium  
**Estimated Time:** 0.5 days  
**Impact:** Prevents server resource exhaustion

#### Steps:
1. **Add file size validation**
   - Check file size before upload
   - Set appropriate limits (e.g., 10MB for PDFs, 5MB for images)
   - Return clear error messages

#### Files to Modify:
- `src/app/api/content/upload/pdf/route.ts`
- `src/app/api/content/upload/image/route.ts`
- `src/app/api/content/upload/video/route.ts`

#### Implementation:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

if (file.size > MAX_FILE_SIZE) {
  return NextResponse.json(
    { success: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
    { status: 400 }
  );
}
```

---

## Phase 4: Low Priority Optimizations (Week 4)
*These are nice-to-have optimizations that improve code quality and observability.*

### 4.1 Optimize JWT Verification
**Priority:** 🟢 Low  
**Estimated Time:** 0.5 days  
**Impact:** Reduces redundant verification

#### Steps:
1. **Pass user from middleware to API routes**
   - Store verified user in request context
   - Skip re-verification in API routes
   - Use Next.js middleware to attach user to request

#### Implementation:
```typescript
// In middleware.ts - attach user to headers
const user = await authService.getCurrentUser(token);
if (user) {
  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);
  return response;
}

// In API routes - read from headers instead of re-verifying
const userId = request.headers.get('x-user-id');
const userRole = request.headers.get('x-user-role');
```

---

### 4.2 Add Query Logging in Production
**Priority:** 🟢 Low  
**Estimated Time:** 0.5 days  
**Impact:** Better observability

#### Steps:
1. **Configure conditional query logging**
   - Log slow queries (>100ms) in production
   - Use structured logging
   - Add query performance metrics

#### Files to Modify:
- `src/core/database/prisma.ts`

#### Implementation:
```typescript
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' 
    ? [
        { emit: 'event', level: 'query' },
        { level: 'error' },
        { level: 'warn' }
      ]
    : ['query', 'error', 'warn'],
});

// Log slow queries
prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn('Slow query detected:', {
      query: e.query,
      duration: e.duration,
      params: e.params
    });
  }
});
```

---

## Testing Strategy

### Unit Tests
- Test pagination logic
- Test batch operations
- Test rate limiting
- Test caching behavior

### Integration Tests
- Test API endpoints with pagination
- Test bulk operations
- Test rate limit enforcement

### Performance Tests
- Load test with large datasets
- Test concurrent requests
- Measure query performance improvements

---

## Monitoring & Metrics

### Key Metrics to Track
1. **API Response Times**
   - P50, P95, P99 latencies
   - Track improvements after each phase

2. **Database Query Counts**
   - Monitor query reduction
   - Track N+1 query elimination

3. **Rate Limiting**
   - Track rate limit hits
   - Monitor blocked requests

4. **Cache Hit Rates**
   - Monitor cache effectiveness
   - Track cache invalidation

5. **Database Connection Pool**
   - Monitor connection usage
   - Track connection timeouts

---

## Rollout Strategy

### Phase-by-Phase Deployment
1. **Phase 1**: Deploy to staging → Test → Deploy to production
2. **Phase 2**: Deploy to staging → Test → Deploy to production
3. **Phase 3**: Deploy incrementally, monitor each change
4. **Phase 4**: Deploy as time permits

### Rollback Plan
- Keep previous service implementations as backup
- Use feature flags for gradual rollout
- Monitor error rates and performance metrics

---

## Success Criteria

### Performance Targets
- ✅ All list endpoints return paginated results
- ✅ Attendance marking: <500ms for 50 students (down from 5+ seconds)
- ✅ API response times: P95 < 200ms
- ✅ Database queries reduced by 70%+
- ✅ Rate limiting active on all endpoints
- ✅ Cache hit rate > 60% for cached endpoints

### Code Quality
- ✅ All N+1 queries eliminated
- ✅ All batch operations optimized
- ✅ Comprehensive error handling
- ✅ Proper logging and monitoring

---

## Notes

- **Database Migrations**: Some changes require database migrations (indexes, schema changes)
- **Breaking Changes**: Pagination changes will require frontend updates
- **Backward Compatibility**: Consider API versioning if needed
- **Documentation**: Update API documentation with pagination details

---

## Estimated Timeline

| Phase | Duration | Priority |
|-------|----------|----------|
| Phase 1 | 1 week | Critical |
| Phase 2 | 1 week | High |
| Phase 3 | 1 week | Medium |
| Phase 4 | 0.5 week | Low |
| **Total** | **3.5 weeks** | |

---

**Last Updated:** [Current Date]  
**Status:** Ready for Implementation

