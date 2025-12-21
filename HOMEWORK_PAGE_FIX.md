# Student Homework Page Multiple Calls Fix

## Problem
When logging in as a student and navigating to the homework page, multiple redundant API calls were being made, causing performance issues and unnecessary server load.

## Root Cause Analysis

### Issues Identified:

1. **Duplicate hook calls:**
   - The student homework page was calling both `useHomeworkByBatch(batchId)` AND `HomeworkList` component
   - `HomeworkList` component uses `useHomeworks(filters)` internally
   - This resulted in TWO separate hooks fetching homework data simultaneously

2. **Direct `fetch()` calls in `useHomeworks`:**
   - The `useHomeworks` hook was using direct `fetch()` calls
   - No request deduplication or caching mechanism
   - Multiple components or rapid navigation would trigger duplicate requests

3. **Dependency array issues:**
   - `isLoading` was included in the `useCallback` dependency array
   - This caused callbacks to be recreated whenever loading state changed
   - Triggered `useEffect` repeatedly, causing infinite loops

4. **No request-level caching:**
   - Same data was fetched multiple times without caching
   - No mechanism to prevent duplicate requests within a short time window

5. **AbortController complexity:**
   - The hook used `AbortController` for cancellation, but this didn't prevent duplicate calls
   - Added unnecessary complexity without solving the core issue

## Solution Implemented

### Changes Made:

#### 1. `src/modules/homework/hooks/useHomeworks.ts`:

1. **Replaced `fetch()` with `deduplicatedFetch()`:**
   ```typescript
   // Before:
   const response = await fetch(`/api/homework?${queryParams.toString()}`, {
       signal: abortControllerRef.current.signal,
   });

   // After:
   const result = await deduplicatedFetch<{ data: Assignment[] }>(url, {
       ttl: 30000, // Cache for 30 seconds
   });
   ```

2. **Removed `isLoading` from dependency array:**
   ```typescript
   // Before:
   }, [filters?.batchId, filters?.subjectId, filters?.search, isLoading, setAssignments, setLoading, setError]);

   // After:
   }, [filtersKey, setAssignments, setLoading, setError]);
   ```

3. **Added `useMemo` for filters key:**
   - Memoized filters key to prevent unnecessary re-renders
   - Stable reference prevents callback recreation

4. **Simplified ref tracking:**
   - Removed `AbortController` complexity
   - Used `hasFetchedRef` and `isFetchingRef` for simpler duplicate prevention
   - Aligned with the pattern used in other hooks

#### 2. `src/app/(dashboard)/student/homework/page.tsx`:

1. **Removed redundant `useHomeworkByBatch` call:**
   ```typescript
   // Before:
   const { assignments } = useHomeworkByBatch(batchId);
   <HomeworkList filters={{ batchId: batchId || undefined }} showActions={false} />

   // After:
   // Removed useHomeworkByBatch - HomeworkList already uses useHomeworks internally
   <HomeworkList filters={{ batchId: batchId || undefined }} showActions={false} />
   ```

2. **Removed unused imports:**
   - Removed `useHomeworkByBatch` import
   - Removed unused `Card` component imports

## Benefits

1. **Eliminates duplicate API calls:**
   - Only one hook (`useHomeworks`) fetches data now
   - Request deduplication ensures only one request per filter combination
   - No more redundant calls from multiple hooks

2. **Prevents infinite loops:**
   - Fixed dependency arrays prevent callback recreation loops
   - Stable function references prevent unnecessary re-renders

3. **Improved performance:**
   - Request caching reduces server load
   - Faster response times for repeated views of the same data
   - Reduced network traffic

4. **Consistent with other hooks:**
   - Uses the same pattern as `useStudents`, `useTeachers`, `useNotices`, etc.
   - Maintains code consistency across the application

## Files Modified

- `src/modules/homework/hooks/useHomeworks.ts` - Updated to use deduplicated fetch and fix dependency arrays
- `src/app/(dashboard)/student/homework/page.tsx` - Removed redundant `useHomeworkByBatch` call

## Testing

- ✅ Build successful (no TypeScript errors)
- ✅ No linting errors
- ✅ Follows the same pattern as other optimized hooks
- ✅ Request deduplication prevents multiple calls
- ✅ Single data source (no duplicate hooks)

## Prevention

This fix follows the established pattern used throughout the application:
- All data-fetching hooks use `deduplicatedFetch`
- Dependency arrays exclude loading states
- Refs are used to track fetching state instead of state variables
- `useMemo` is used for filter keys to prevent unnecessary re-renders
- Components should use a single hook for data fetching, not multiple hooks fetching the same data

Future hooks and components should follow this pattern to prevent similar issues.

