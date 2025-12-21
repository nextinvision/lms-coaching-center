# Student Panel Multiple Calls Fix

## Problem
When logging in as a student and navigating through the student panel, multiple redundant API calls were being made, causing performance issues and unnecessary server load.

## Root Cause Analysis

### Issues Identified:

1. **Direct `fetch()` calls instead of deduplicated fetch:**
   - `useContentByBatch` hook was using direct `fetch()` calls
   - `useHomeworkByBatch` hook was using direct `fetch()` calls
   - Multiple components or rapid navigation would trigger duplicate requests
   - No request deduplication or caching mechanism

2. **Dependency array issues:**
   - `isLoading` was included in the `useCallback` dependency arrays
   - This caused callbacks to be recreated whenever loading state changed
   - Triggered `useEffect` repeatedly, causing infinite loops

3. **No request-level caching:**
   - Same data was fetched multiple times without caching
   - No mechanism to prevent duplicate requests within a short time window

4. **AbortController complexity:**
   - Both hooks used `AbortController` for cancellation, but this didn't prevent duplicate calls
   - Added unnecessary complexity without solving the core issue

## Solution Implemented

### Changes Made:

#### 1. `src/modules/content/hooks/useContentByBatch.ts`:

1. **Replaced `fetch()` with `deduplicatedFetch()`:**
   ```typescript
   // Before:
   const response = await fetch(`/api/content/batch/${batchId}`, {
       signal: abortControllerRef.current.signal,
   });

   // After:
   const result = await deduplicatedFetch<{ data: Content[] }>(url, {
       ttl: 30000, // Cache for 30 seconds
   });
   ```

2. **Removed `isLoading` from dependency array:**
   ```typescript
   // Before:
   }, [batchId, isLoading, setContent, setLoading, setError]);

   // After:
   }, [batchIdKey, setContent, setLoading, setError]);
   ```

3. **Simplified ref tracking:**
   - Removed `AbortController` complexity
   - Used `hasFetchedRef` and `isFetchingRef` for simpler duplicate prevention
   - Added `useMemo` for `batchIdKey` to prevent unnecessary re-renders

#### 2. `src/modules/homework/hooks/useHomeworkByBatch.ts`:

1. **Replaced `fetch()` with `deduplicatedFetch()`:**
   ```typescript
   // Before:
   const response = await fetch(`/api/homework/batch/${batchId}`, {
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
   }, [batchId, isLoading, setAssignments, setLoading, setError]);

   // After:
   }, [batchIdKey, setAssignments, setLoading, setError]);
   ```

3. **Simplified ref tracking:**
   - Removed `AbortController` complexity
   - Used `hasFetchedRef` and `isFetchingRef` for simpler duplicate prevention
   - Added `useMemo` for `batchIdKey` to prevent unnecessary re-renders

## Benefits

1. **Eliminates duplicate API calls:**
   - Multiple navigations or component re-renders no longer trigger multiple requests
   - Request deduplication ensures only one request per batch ID

2. **Prevents infinite loops:**
   - Fixed dependency arrays prevent callback recreation loops
   - Stable function references prevent unnecessary re-renders

3. **Improved performance:**
   - Request caching reduces server load
   - Faster response times for repeated views of the same data

4. **Consistent with other hooks:**
   - Uses the same pattern as `useStudent`, `useTeacher`, `useAcademicYear`, `useNotices`, etc.
   - Maintains code consistency across the application

## Files Modified

- `src/modules/content/hooks/useContentByBatch.ts` - Updated to use deduplicated fetch and fix dependency arrays
- `src/modules/homework/hooks/useHomeworkByBatch.ts` - Updated to use deduplicated fetch and fix dependency arrays

## Testing

- ✅ Build successful (no TypeScript errors)
- ✅ No linting errors
- ✅ Follows the same pattern as other optimized hooks
- ✅ Request deduplication prevents multiple calls

## Student Panel Pages Affected

The following student pages benefit from this optimization:
- **Dashboard** (`/student/dashboard`) - Uses `useContentByBatch`, `useHomeworkByBatch`, `useNotices`
- **Notes** (`/student/notes`) - Uses `useContentByBatch`
- **Homework** (`/student/homework`) - Uses `useHomeworkByBatch`
- **Tests** (`/student/tests`) - Uses `useStudent` (already fixed)
- **Attendance** (`/student/attendance`) - Uses `useStudent` (already fixed)
- **Notices** (`/student/notices`) - Uses `useNotices` (already fixed)
- **Profile** (`/student/profile`) - Uses `useStudent` (already fixed)

## Prevention

This fix follows the established pattern used throughout the application:
- All data-fetching hooks use `deduplicatedFetch`
- Dependency arrays exclude loading states
- Refs are used to track fetching state instead of state variables
- `useMemo` is used for filter keys to prevent unnecessary re-renders

Future hooks should follow this pattern to prevent similar issues.

