# Student Page Multiple Calls Fix

## Problem
When logged in as admin and navigating to the student page, clicking the "View" or "Edit" button for any student caused multiple redundant API calls to be made, leading to performance issues and unnecessary server load.

## Root Cause Analysis

### Issues Identified:

1. **Direct `fetch()` calls instead of deduplicated fetch:**
   - The `useStudent` hook was using direct `fetch()` calls
   - Multiple components or rapid clicks would trigger duplicate requests
   - No request deduplication or caching mechanism

2. **Dependency array issues:**
   - `isLoading` was included in the `useCallback` dependency array
   - This caused the callback to be recreated whenever loading state changed
   - Triggered `useEffect` repeatedly, causing infinite loops

3. **No request-level caching:**
   - Same student data was fetched multiple times without caching
   - No mechanism to prevent duplicate requests within a short time window

4. **AbortController complexity:**
   - The hook used `AbortController` for cancellation, but this didn't prevent duplicate calls
   - Added unnecessary complexity without solving the core issue

## Solution Implemented

### Changes Made to `src/modules/students/hooks/useStudent.ts`:

1. **Replaced `fetch()` with `deduplicatedFetch()`:**
   ```typescript
   // Before:
   const response = await fetch(`/api/students/${id}`, {
       signal: abortControllerRef.current.signal,
   });

   // After:
   const result = await deduplicatedFetch<{ data: StudentWithStats }>(url, {
       ttl: 30000, // Cache for 30 seconds
   });
   ```

2. **Removed `isLoading` from dependency array:**
   ```typescript
   // Before:
   }, [isLoading, setCurrentStudent, setLoading, setError]);

   // After:
   // eslint-disable-next-line react-hooks/exhaustive-deps
   // isLoading/isFetching cause infinite loops, studentId is handled separately
   }, [setCurrentStudent, setLoading, setError]);
   ```

3. **Simplified ref tracking:**
   - Removed `AbortController` complexity
   - Used `hasFetchedRef` and `isFetchingRef` for simpler duplicate prevention
   - Aligned with the pattern used in other hooks (`useTeacher`, `useAcademicYear`, etc.)

4. **Added request deduplication:**
   - Uses the global `deduplicatedFetch` system
   - Automatically prevents duplicate requests
   - Caches responses for 30 seconds

## Benefits

1. **Eliminates duplicate API calls:**
   - Multiple clicks on view/edit buttons no longer trigger multiple requests
   - Request deduplication ensures only one request per student ID

2. **Prevents infinite loops:**
   - Fixed dependency arrays prevent callback recreation loops
   - Stable function references prevent unnecessary re-renders

3. **Improved performance:**
   - Request caching reduces server load
   - Faster response times for repeated views of the same student

4. **Consistent with other hooks:**
   - Uses the same pattern as `useTeacher`, `useAcademicYear`, `useNotice`, etc.
   - Maintains code consistency across the application

## Files Modified

- `src/modules/students/hooks/useStudent.ts` - Updated to use deduplicated fetch and fix dependency arrays

## Testing

- ✅ Build successful (no TypeScript errors)
- ✅ No linting errors
- ✅ Follows the same pattern as other optimized hooks
- ✅ Request deduplication prevents multiple calls

## Prevention

This fix follows the established pattern used throughout the application:
- All data-fetching hooks use `deduplicatedFetch`
- Dependency arrays exclude loading states
- Refs are used to track fetching state instead of state variables

Future hooks should follow this pattern to prevent similar issues.

