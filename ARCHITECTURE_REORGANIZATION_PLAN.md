# Architecture Reorganization Plan

## Current vs. Expected Structure

### Issues Found:

1. **Route Groups Missing:**
   - Current: `src/app/login/page.tsx`
   - Expected: `src/app/(auth)/login/page.tsx`
   - Current: `src/app/student/dashboard/page.tsx`
   - Expected: `src/app/(dashboard)/student/dashboard/page.tsx`

2. **Missing Layout Files:**
   - `src/app/(auth)/layout.tsx` - Auth route group layout
   - `src/app/(dashboard)/layout.tsx` - Dashboard route group layout

3. **Missing Language Select Route:**
   - Expected: `src/app/(auth)/language-select/page.tsx`

4. **Root `src/lib/` Directory:**
   - Current: `src/lib/assets.ts`
   - Expected: Should be in `src/lib/` (External Libraries Config) - This is correct

## Reorganization Steps:

1. Create `(auth)` route group
   - Move `login/page.tsx` → `(auth)/login/page.tsx`
   - Create `(auth)/layout.tsx`
   - Create `(auth)/language-select/page.tsx` (if needed)

2. Create `(dashboard)` route group
   - Move `student/dashboard/page.tsx` → `(dashboard)/student/dashboard/page.tsx`
   - Move `teacher/dashboard/page.tsx` → `(dashboard)/teacher/dashboard/page.tsx`
   - Move `admin/dashboard/page.tsx` → `(dashboard)/admin/dashboard/page.tsx`
   - Create `(dashboard)/layout.tsx`

3. Update all imports after moving files

4. Verify build works

