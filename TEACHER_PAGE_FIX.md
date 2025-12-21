# Teacher Page Multiple API Calls Fix

## Problem Identified

When admin navigates to `/admin/teachers` page, multiple redundant API calls were being made, causing:
- Hundreds of 403 errors for `/api/teachers`
- Performance degradation
- Infinite loops in hooks

## Root Cause Analysis

### 1. **`useTeachers` Hook Issues** ❌
   - **Infinite Loop**: Had `isFetching` and `isLoading` in dependency array (line 67)
   - **No Deduplication**: Used direct `fetch()` instead of `deduplicatedFetch`
   - **Multiple Calls**: When `TeacherList` component mounted, it triggered multiple fetches

### 2. **`useTeacher` Hook Issues** ❌
   - **Infinite Loop**: Had `isFetching` and `isLoading` in dependency array (line 57)
   - **No Deduplication**: Used direct `fetch()` instead of `deduplicatedFetch`
   - **Used in**: Admin teacher details page (`/admin/teachers/[id]`)

### 3. **Component Chain**
   ```
   AdminTeachersPage
     └─> TeacherList
           └─> useTeachers() → Multiple API calls (infinite loop)
   
   AdminTeacherDetailsPage
     └─> useTeacher() → Multiple API calls (infinite loop)
   ```

## Solution Implemented

### 1. Fixed `useTeachers` Hook ✅

**Before:**
```typescript
const fetchTeachers = useCallback(async () => {
    // Direct fetch, no deduplication
    const response = await fetch(`/api/teachers?...`);
    // ...
}, [filters?.search, filters?.batchId, isFetching, isLoading, ...]);
// ❌ isFetching and isLoading cause infinite loops
```

**After:**
```typescript
const filtersKey = useMemo(() => JSON.stringify({...}), [filters]);
const fetchTeachers = useCallback(async () => {
    // Use deduplicated fetch
    const result = await deduplicatedFetch<{ data: Teacher[] }>(url, {
        ttl: 30000,
    });
    // ...
}, [filtersKey, setTeachers, setLoading, setError]);
// ✅ Removed isFetching/isLoading, uses deduplication
```

### 2. Fixed `useTeacher` Hook ✅

**Before:**
```typescript
const fetchTeacher = useCallback(async (id: string) => {
    // Direct fetch, no deduplication
    const response = await fetch(`/api/teachers/${id}`);
    // ...
}, [isFetching, isLoading, ...]);
// ❌ isFetching and isLoading cause infinite loops
```

**After:**
```typescript
const fetchTeacher = useCallback(async (id: string) => {
    // Use deduplicated fetch
    const result = await deduplicatedFetch<{ data: Teacher }>(url, {
        ttl: 30000,
    });
    // ...
}, [setCurrentTeacher, setLoading, setError]);
// ✅ Removed isFetching/isLoading, uses deduplication
```

## Changes Made

### Files Modified:
1. ✅ `src/modules/teachers/hooks/useTeachers.ts`
   - Removed `isFetching` and `isLoading` from dependencies
   - Replaced `fetch()` with `deduplicatedFetch()`
   - Added `useMemo` for filters key
   - Added `hasFetchedRef` to prevent duplicate calls

2. ✅ `src/modules/teachers/hooks/useTeacher.ts`
   - Removed `isFetching` and `isLoading` from dependencies
   - Replaced `fetch()` with `deduplicatedFetch()`
   - Added `hasFetchedRef` to prevent duplicate calls
   - Improved error handling

## Impact

### Before Fix:
- **Admin navigates to `/admin/teachers`**: 100+ API calls
- **Multiple 403 errors**: Same endpoint called repeatedly
- **Infinite loops**: Hooks re-rendering continuously
- **Page freezes**: Browser becomes unresponsive

### After Fix:
- **Admin navigates to `/admin/teachers`**: ~1-2 API calls (deduplicated)
- **No redundant calls**: Deduplication prevents duplicates
- **No infinite loops**: Fixed hook dependencies
- **Fast page load**: Cached responses reduce requests

## Testing Checklist

- [x] Admin can navigate to `/admin/teachers` without errors
- [x] Teacher list loads correctly
- [x] No infinite loops in console
- [x] No 403 spam in terminal logs
- [x] Admin can view teacher details (`/admin/teachers/[id]`)
- [x] Page loads quickly

## Pattern Applied

The same pattern used for `useStudents` and `useBatches`:

1. **Use `deduplicatedFetch`** instead of `fetch`
2. **Remove `isLoading`/`isFetching`** from dependency arrays
3. **Use `useMemo`** for filter keys
4. **Use `hasFetchedRef`** to prevent duplicate calls in same render cycle
5. **Add proper error handling** with refs

## Related Issues Fixed

This fix also resolves issues in:
- Admin teacher management page
- Admin teacher details page
- Any component using `useTeachers` or `useTeacher` hooks

---

**Status**: ✅ **FIXED - Root level solution implemented**

**Next Steps**: Consider applying same pattern to remaining hooks:
- `useHomeworks`
- `useNotices`
- `useContent`
- etc.

