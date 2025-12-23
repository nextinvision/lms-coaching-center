# Quick Start: Implementing Pagination

This guide shows you how to quickly implement pagination for one endpoint as a template for others.

## Step-by-Step Implementation

### Step 1: Update Shared Utilities

First, ensure pagination utilities exist (they already do, but verify):

**File:** `src/shared/utils/pagination.ts` ✅ (Already exists)

### Step 2: Update Service Method

**Example:** Updating `studentService.getAll()`

**File:** `src/modules/students/services/studentService.ts`

```typescript
import { PaginationParams, PaginationResult } from '@/shared/utils/pagination';

// Add pagination to method signature
async getAll(
  filters?: StudentFilters,
  pagination?: PaginationParams
): Promise<PaginationResult<Student>> {
  const where: any = {};

  // ... existing filter logic ...

  // Add pagination
  const { page = 1, limit = 10, skip = 0 } = pagination || {};
  const take = Math.min(limit, 1000); // Enforce max limit

  // Get total count (for pagination metadata)
  const total = await prisma.student.count({ where });

  // Get paginated results
  const students = await prisma.student.findMany({
    where,
    include: {
      user: true,
      batch: true,
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });

  return {
    data: students as Student[],
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
      hasNext: page * take < total,
      hasPrev: page > 1,
    },
  };
}
```

### Step 3: Update Type Definitions

**File:** `src/modules/students/types/student.types.ts`

```typescript
// Add pagination result type if not exists
export type StudentListResult = PaginationResult<Student>;
```

### Step 4: Update API Route

**File:** `src/app/api/students/route.ts`

```typescript
import { parsePaginationQuery } from '@/shared/utils/pagination';

export async function GET(request: Request) {
  try {
    // ... existing auth code ...

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId') || undefined;
    const search = searchParams.get('search') || undefined;
    const isActive = searchParams.get('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined;

    // Parse pagination
    const pagination = parsePaginationQuery({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    // Call service with pagination
    const result = await studentService.getAll(
      { batchId, search, isActive },
      pagination
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    // ... error handling ...
  }
}
```

### Step 5: Update Frontend Hook

**File:** `src/modules/students/hooks/useStudents.ts`

```typescript
export function useStudents(filters?: StudentFilters) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['students', filters, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.batchId) params.set('batchId', filters.batchId);
      if (filters?.search) params.set('search', filters.search);
      params.set('page', String(page));
      params.set('limit', String(limit));

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  return {
    students: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    setPage,
    limit,
    setLimit,
  };
}
```

### Step 6: Update Frontend Component

**File:** Example component using pagination

```typescript
import { Pagination } from '@/shared/components/ui/Pagination';

export function StudentList() {
  const { students, pagination, page, setPage, isLoading } = useStudents();

  if (isLoading) return <Loader />;

  return (
    <div>
      {/* Student list */}
      {students.map(student => (
        <StudentCard key={student.id} student={student} />
      ))}

      {/* Pagination controls */}
      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
```

## Testing

### Test Pagination Works

```bash
# Test with page 1, 10 items
curl http://localhost:3000/api/students?page=1&limit=10

# Test with page 2
curl http://localhost:3000/api/students?page=2&limit=10

# Test with filters + pagination
curl http://localhost:3000/api/students?batchId=xxx&page=1&limit=20
```

### Expected Response Format

```json
{
  "success": true,
  "data": [
    { /* student objects */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Copy-Paste Template

Use this template for other services:

```typescript
// Service method template
async getAll(
  filters?: EntityFilters,
  pagination?: PaginationParams
): Promise<PaginationResult<Entity>> {
  const where: any = {};
  // ... filter logic ...

  const { page = 1, limit = 10, skip = 0 } = pagination || {};
  const take = Math.min(limit, 1000);

  const [total, data] = await Promise.all([
    prisma.entity.count({ where }),
    prisma.entity.findMany({
      where,
      include: { /* relations */ },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
  ]);

  return {
    data: data as Entity[],
    pagination: {
      page,
      limit: take,
      total,
      totalPages: Math.ceil(total / take),
      hasNext: page * take < total,
      hasPrev: page > 1,
    },
  };
}
```

## Next Steps

1. ✅ Implement pagination for one endpoint (students)
2. ✅ Test thoroughly
3. ✅ Apply same pattern to other endpoints:
   - Content
   - Tests
   - Homework
   - Attendance
   - Batches
   - Teachers
   - Notices

## Common Issues

### Issue: Frontend breaks after adding pagination
**Solution:** Update frontend hooks and components to handle paginated response structure

### Issue: Performance still slow
**Solution:** 
- Check if indexes exist on filtered/sorted columns
- Verify `skip` and `take` are being applied correctly
- Consider cursor-based pagination for very large datasets

### Issue: Total count is slow
**Solution:** 
- Add indexes on filtered columns
- Consider approximate counts for very large datasets
- Cache count results if data doesn't change frequently

