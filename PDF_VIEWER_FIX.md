# PDF Viewer and Scroll Behavior Fix

## Problems Identified

1. **Next.js Scroll Behavior Warning**: Missing `scroll-behavior="smooth"` attribute on `<html>` element
2. **PDF.js Worker 404 Error**: PDF.js worker file not loading from CDN (version 5.4.296 not found)

## Root Cause Analysis

### Issue 1: Scroll Behavior Warning
- Next.js expects `scroll-behavior="smooth"` as an HTML attribute, not just CSS
- CSS had it set, but Next.js router needs it on the actual HTML element

### Issue 2: PDF.js Worker Error
- Using `cdnjs.cloudflare.com` which doesn't have version 5.4.296
- The version from `react-pdf` package might not match CDN availability
- Need a more reliable CDN source

## Solution Implemented

### 1. Added Scroll Behavior to HTML Element ✅

**File**: `src/app/layout.tsx`
- Added `style={{ scrollBehavior: 'smooth' }}` to `<html>` element
- This satisfies Next.js requirement while maintaining CSS fallback

### 2. Fixed PDF.js Worker CDN ✅

**File**: `src/modules/content/components/PDFViewer.tsx`
- Changed from `cdnjs.cloudflare.com` to `unpkg.com`
- `unpkg.com` reliably hosts npm packages including `pdfjs-dist`
- Uses the version from the installed `react-pdf` package dynamically
- Better error handling with catch block

**Before:**
```typescript
module.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${module.pdfjs.version}/pdf.worker.min.js`;
```

**After:**
```typescript
module.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
```

## Files Modified

1. **`src/app/layout.tsx`**
   - Added `style={{ scrollBehavior: 'smooth' }}` to `<html>` element

2. **`src/modules/content/components/PDFViewer.tsx`**
   - Changed PDF.js worker CDN to unpkg.com
   - Removed unused `useEffect` import
   - Simplified worker setup

## Why unpkg.com?

1. **Reliability**: Directly serves npm packages, always up-to-date
2. **Version Support**: Supports all versions available on npm
3. **Consistency**: Matches the installed package version exactly
4. **Performance**: Fast CDN with global distribution

## Testing Checklist

- [x] Scroll behavior warning resolved
- [x] PDF.js worker loads successfully
- [x] PDFs display correctly in viewer
- [x] No console errors
- [x] Build passes without errors

## Technical Details

### Worker URL Format
- **unpkg.com**: `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`
- **jsdelivr** (alternative): `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`
- **cdnjs** (old, unreliable): `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`

### Version Detection
The worker uses the version from the installed `react-pdf` package:
```typescript
const version = module.pdfjs.version; // e.g., "4.0.379" or "5.4.296"
```

This ensures compatibility between the main library and worker.

## Future Improvements (Optional)

1. **Local Worker**: Bundle worker file locally for offline support
2. **Worker Caching**: Cache worker file in service worker
3. **Fallback Chain**: Implement multiple CDN fallbacks
4. **Version Pinning**: Pin to a specific known-working version

