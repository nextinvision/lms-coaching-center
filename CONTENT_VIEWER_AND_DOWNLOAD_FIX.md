# Content Viewer and Download Fix

## Problems Identified

1. **Content opens in new tab**: Clicking on content cards opened files in a new browser tab instead of viewing within the platform
2. **PDF downloads in random format**: PDF downloads didn't preserve the filename and sometimes downloaded with incorrect format
3. **No teacher content viewer**: Teacher panel didn't have a dedicated content viewer page

## Root Cause Analysis

### Issue 1: Content Navigation
- `ContentCard` component had `onClick` handler but `ContentList` wasn't navigating to viewer pages
- Student panel had viewer at `/student/notes/[id]` but teacher panel was missing one
- Content cards were opening files directly via `window.open()` instead of navigating to viewer

### Issue 2: Download Format Issues
- Downloads used `window.open(url, '_blank')` which doesn't properly download files
- No proper filename preservation
- No MIME type handling
- PDFs downloaded without `.pdf` extension

## Solution Implemented

### 1. Created Teacher Content Viewer Page ✅

**File**: `src/app/(dashboard)/teacher/content/[id]/page.tsx`
- New page for teachers to view content in-platform
- Uses same `FileViewer` component as student panel
- Proper navigation with back button
- Protected route with `upload_content` permission

### 2. Created File Download Utility ✅

**File**: `src/core/utils/fileDownload.ts`
- `downloadFile()`: Generic file download with proper filename and MIME type
- `downloadPDF()`: PDF-specific download ensuring `.pdf` extension
- `downloadImage()`: Image download with proper format detection
- `extractFilenameFromUrl()`: Extracts filename from Cloudinary URLs
- `getFileExtension()`: Gets file extension from URL/filename

**Features**:
- Proper blob handling
- Object URL creation and cleanup
- Filename preservation
- MIME type handling
- Error handling with fallback

### 3. Updated ContentCard Component ✅

**Changes**:
- Replaced `window.open()` with proper download functions
- Added filename extraction and preservation
- Proper error handling with fallback
- Type-specific download handling (PDF vs Image)

### 4. Updated ContentList Component ✅

**Changes**:
- Added automatic navigation to viewer pages
- Detects current route (teacher vs student) and navigates accordingly
- Teacher: `/teacher/content/[id]`
- Student: `/student/notes/[id]`
- Maintains backward compatibility with custom `onContentClick` prop

### 5. Updated PDFViewer Component ✅

**Changes**:
- Replaced `window.open()` with `downloadPDF()` utility
- Proper filename preservation
- Error handling with fallback

### 6. Updated FileViewer Component ✅

**Changes**:
- Image download now uses proper download utility
- Filename and format preservation
- Proper image type detection

### 7. Optimized useContent Hook ✅

**Changes**:
- Replaced direct `fetch()` with `deduplicatedFetch()`
- Added request deduplication and caching
- Removed `AbortController` complexity
- Added `refetch` function for manual refresh
- Fixed dependency arrays to prevent infinite loops

## Files Modified

1. **`src/app/(dashboard)/teacher/content/[id]/page.tsx`** (NEW)
   - Teacher content viewer page

2. **`src/core/utils/fileDownload.ts`** (NEW)
   - File download utility with proper handling

3. **`src/modules/content/components/ContentCard.tsx`**
   - Updated download functionality
   - Proper filename handling

4. **`src/modules/content/components/ContentList.tsx`**
   - Added automatic navigation to viewer pages
   - Route detection based on current path

5. **`src/modules/content/components/PDFViewer.tsx`**
   - Updated PDF download functionality

6. **`src/modules/content/components/FileViewer.tsx`**
   - Updated image download functionality

7. **`src/modules/content/hooks/useContent.ts`**
   - Optimized with deduplication
   - Added caching

## How It Works Now

### Content Viewing Flow

1. **User clicks content card**:
   - `ContentList` detects current route
   - Navigates to appropriate viewer page:
     - Teacher → `/teacher/content/[id]`
     - Student → `/student/notes/[id]`

2. **Viewer page loads**:
   - Fetches content using optimized `useContent` hook
   - Displays content using `FileViewer` component
   - PDFs: In-platform PDF viewer with page navigation
   - Images: Full-size image display
   - Videos: Video player

3. **Download functionality**:
   - Download button triggers proper download
   - Filename preserved from content metadata or URL
   - Proper file format and extension
   - Works for PDFs, images, and other files

### Download Flow

1. **User clicks download**:
   - File is fetched as blob
   - Object URL created
   - Download link created with proper filename and MIME type
   - Link clicked programmatically
   - Object URL cleaned up

2. **Filename handling**:
   - Uses `content.fileName` if available
   - Falls back to extracting from URL
   - Ensures proper extension (`.pdf` for PDFs, image extensions for images)

## Testing Checklist

- [x] Content cards navigate to in-platform viewer (not new tab)
- [x] Teacher panel has content viewer page
- [x] Student panel content viewer still works
- [x] PDF downloads with correct filename and `.pdf` extension
- [x] Image downloads with correct filename and format
- [x] Download works from content card
- [x] Download works from viewer page
- [x] Error handling works (fallback to opening in new tab)
- [x] Build passes without errors
- [x] No linter errors

## Benefits

1. **Better UX**: Content viewed within platform, maintaining context
2. **Proper Downloads**: Files download with correct names and formats
3. **Consistent Experience**: Same viewer for both teacher and student panels
4. **Performance**: Optimized hooks with caching and deduplication
5. **Error Handling**: Graceful fallbacks if download fails

## Technical Details

### Download Utility Pattern

```typescript
// Generic download
await downloadFile(url, filename, { mimeType: 'application/pdf' });

// PDF-specific
await downloadPDF(url, filename);

// Image-specific
await downloadImage(url, filename, 'jpeg');
```

### Navigation Pattern

```typescript
// Automatic route detection
const currentPath = window.location.pathname;
if (currentPath.includes('/teacher/')) {
    router.push(`/teacher/content/${contentId}`);
} else {
    router.push(`/student/notes/${contentId}`);
}
```

## Future Enhancements (Optional)

1. **Full-screen viewer**: Modal/full-screen option for images and PDFs
2. **Download progress**: Show download progress for large files
3. **Print functionality**: Add print button for PDFs
4. **Keyboard navigation**: Arrow keys for PDF page navigation
5. **Zoom controls**: Zoom in/out for images and PDFs

