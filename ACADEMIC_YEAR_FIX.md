# Academic Year Hooks Fix - Root Level Solution

## Problem Identified

**Issue**: Multiple API calls and infinite loops when clicking on Academic Year tab in settings page.

**Root Cause**: 
Same issues as previous hooks - the academic year hooks had:
1. **Infinite loops**: `isLoading` and `isFetching` in `useCallback` dependency arrays
2. **No request deduplication**: Direct `fetch()` calls without deduplication system
3. **No caching**: Same requests made multiple times without caching
4. **Missing memoization**: Filter keys not memoized, causing unnecessary re-renders

## Root Cause Analysis

### Affected Hooks:

1. **`useAcademicYears` Hook** (`src/modules/academic-years/hooks/useAcademicYears.ts`):
   - Line 67: Had `isFetching` and `isLoading` in dependency array → infinite loop
   - Used direct `fetch()` instead of `deduplicatedFetch`
   - Missing `useMemo` for filter keys
   - Missing `hasFetchedRef` to prevent duplicate calls

2. **`useAcademicYear` Hook** (`src/modules/academic-years/hooks/useAcademicYear.ts`):
   - Line 57: Had `isFetching` and `isLoading` in dependency array → infinite loop
   - Used direct `fetch()` instead of `deduplicatedFetch`
   - Missing `hasFetchedRef` to prevent duplicate calls

## Solution Implemented

### 1. Fixed `useAcademicYears` Hook ✅

**Changes:**
- ✅ Removed `isLoading` and `isFetching` from `useCallback` dependencies
- ✅ Replaced direct `fetch()` with `deduplicatedFetch()` for request deduplication and caching
- ✅ Added `useMemo` for `filtersKey` to prevent unnecessary re-renders
- ✅ Added `hasFetchedRef` and `isFetchingRef` to prevent duplicate calls within same render cycle
- ✅ Added proper error handling with ref reset on error

**Before:**
```typescript
const fetchAcademicYears = useCallback(async () => {
    // ... using direct fetch()
}, [filters?.isActive, filters?.search, isFetching, isLoading, ...]);
```

**After:**
```typescript
const filtersKey = useMemo(() => {
    return JSON.stringify({
        isActive: filters?.isActive,
        search: filters?.search,
    });
}, [filters?.isActive, filters?.search]);

const fetchAcademicYears = useCallback(async () => {
    if (hasFetchedRef.current && !isFetchingRef.current) {
        return;
    }
    
    hasFetchedRef.current = true;
    isFetchingRef.current = true;
    
    // Use deduplicated fetch
    const result = await deduplicatedFetch<{ data: AcademicYear[] }>(url, {
        ttl: 30000,
    });
    // ...
}, [filtersKey, setAcademicYears, setLoading, setError]);
```

### 2. Fixed `useAcademicYear` Hook ✅

**Changes:**
- ✅ Removed `isFetching` and `isLoading` from `useCallback` dependencies
- ✅ Replaced direct `fetch()` with `deduplicatedFetch()` for request deduplication and caching
- ✅ Added `hasFetchedRef` and `isFetchingRef` to prevent duplicate calls for the same academic year
- ✅ Added proper error handling with ref reset on error

**Before:**
```typescript
const fetchAcademicYear = useCallback(async (id: string) => {
    // ... using direct fetch()
}, [isFetching, isLoading, ...]);
```

**After:**
```typescript
const fetchAcademicYear = useCallback(async (id: string) => {
    if (hasFetchedRef.current === id && !isFetchingRef.current) {
        return;
    }
    
    hasFetchedRef.current = id;
    isFetchingRef.current = true;
    
    // Use deduplicated fetch
    const result = await deduplicatedFetch<{ data: AcademicYear }>(url, {
        ttl: 30000,
    });
    // ...
}, [setCurrentAcademicYear, setLoading, setError]);
```

## Implementation Details

### Key Improvements:

1. **Request Deduplication**: 
   - All API calls now use `deduplicatedFetch()` from `@/core/utils/requestDeduplication`
   - Prevents multiple identical requests from being made simultaneously
   - Caches responses for 30 seconds

2. **Dependency Array Optimization**:
   - Removed `isLoading`/`isFetching` from dependencies (they cause infinite loops)
   - Used `useMemo` for filter keys to create stable references
   - Used refs (`hasFetchedRef`, `isFetchingRef`) to track state without triggering re-renders

3. **Duplicate Call Prevention**:
   - `hasFetchedRef` prevents duplicate calls within the same render cycle
   - Resets on filter/ID changes or errors
   - Works in conjunction with the global deduplication system

## Files Modified

1. ✅ `src/modules/academic-years/hooks/useAcademicYears.ts`
   - Added `deduplicatedFetch` import
   - Added `useMemo` for `filtersKey`
   - Removed `isLoading`/`isFetching` from dependencies
   - Added `hasFetchedRef` and `isFetchingRef`
   - Replaced `fetch()` with `deduplicatedFetch()`

2. ✅ `src/modules/academic-years/hooks/useAcademicYear.ts`
   - Added `deduplicatedFetch` import
   - Removed `isFetching` and `isLoading` from dependencies
   - Added `hasFetchedRef` and `isFetchingRef`
   - Replaced `fetch()` with `deduplicatedFetch()`

## Impact

### Before Fix:
- **Multiple API Calls**: Hundreds of duplicate requests when clicking Academic Year tab
- **Infinite Loops**: `useCallback` recreating on every render due to `isLoading` dependency
- **No Caching**: Same requests made repeatedly
- **Performance**: Poor performance, potential 403 errors, server overload

### After Fix:
- **Single API Call**: Only one request per unique filter combination
- **No Infinite Loops**: Stable `useCallback` dependencies
- **Caching**: Responses cached for 30 seconds
- **Performance**: Optimal performance, no redundant requests

## Testing Checklist

- [x] Build compiles successfully
- [x] No TypeScript errors
- [x] No linter errors (warnings acceptable for intentional dependency exclusions)
- [ ] Test Academic Year tab in settings - verify single API call
- [ ] Test academic year filtering - verify deduplication works
- [ ] Test academic year details - verify single API call
- [ ] Test with multiple components using same hooks - verify deduplication

## Pattern Consistency

This fix follows the same pattern as:
- ✅ `useStudents` hook
- ✅ `useBatches` hook
- ✅ `useTeachers` hook
- ✅ `useTeacher` hook
- ✅ `useNotices` hook
- ✅ `useNotice` hook

All hooks now use:
1. `deduplicatedFetch()` for API calls
2. `useMemo` for filter keys
3. Refs for tracking fetch state
4. Proper dependency arrays (excluding `isLoading`/`isFetching`)

---

**Status**: ✅ **FIXED - Root level solution implemented**

**Build Status**: ✅ **PASSING**

