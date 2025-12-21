# Profile Image Upload Implementation

## Overview

Complete root-level implementation of profile image upload functionality using Cloudinary. Students (and all users) can now directly upload profile images instead of entering URLs.

## Problem Identified

Previously, users had to manually enter an image URL for their profile picture. This was inconvenient and required users to host images elsewhere.

## Solution Implemented

### 1. New API Route for Profile Image Upload ✅

**File**: `src/app/api/settings/profile/upload-image/route.ts`

**Features:**
- Accepts image file uploads
- Validates file type (images only)
- Validates file size (max 5MB)
- Uploads to Cloudinary in `profiles/user-{userId}` folder
- Returns image URL, publicId, and thumbnailUrl
- Works for all user roles (STUDENT, TEACHER, ADMIN)

**Key Code:**
```typescript
// Upload to Cloudinary in profiles folder with user ID
const folder = `profiles/user-${user.id}`;
const { url, publicId, thumbnailUrl } = await cloudinaryStorage.uploadImage(file, folder);
```

### 2. Updated ProfileSettings Component ✅

**File**: `src/modules/settings/components/ProfileSettings.tsx`

**Changes:**
- Replaced URL input with file upload component
- Added image preview functionality
- Added remove image button
- Kept URL input as optional fallback
- Added loading states for upload
- Integrated with Cloudinary upload API
- Added translations support

**New Features:**
1. **File Upload Component**: Uses `FileUpload` component for drag-and-drop or click-to-upload
2. **Image Preview**: Shows circular preview of uploaded/selected image
3. **Remove Button**: Allows users to remove uploaded image
4. **URL Fallback**: Still supports manual URL entry for backward compatibility
5. **Toast Notifications**: Shows success/error messages
6. **Loading States**: Disables form during upload

### 3. Enhanced User Experience ✅

**Visual Features:**
- Circular image preview (128x128px)
- Remove button overlay on preview
- File upload with drag-and-drop support
- Helper text with file size and format info
- Optional URL input below upload area

**Functional Features:**
- Automatic image URL update after upload
- Preview updates immediately
- Form validation (file type, size)
- Error handling with user-friendly messages
- Success feedback via toast notifications

## Files Modified

1. **`src/app/api/settings/profile/upload-image/route.ts`** (NEW)
   - API route for profile image upload
   - Cloudinary integration
   - File validation

2. **`src/modules/settings/components/ProfileSettings.tsx`**
   - Added file upload functionality
   - Added image preview
   - Added remove image functionality
   - Added translations
   - Enhanced UI/UX

3. **`src/core/i18n/translations/en.json`**
   - Added translations for profile settings

4. **`src/core/i18n/translations/as.json`**
   - Added Assamese translations for profile settings

## API Endpoint

### POST `/api/settings/profile/upload-image`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with `file` field

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "lms/profiles/user-123/image",
    "thumbnailUrl": "https://res.cloudinary.com/...",
    "fileName": "profile.jpg",
    "fileSize": 123456
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Cloudinary Storage Structure

```
lms/
  └── profiles/
      └── user-{userId}/
          └── {timestamp}-{filename}
```

**Benefits:**
- Organized by user ID
- Easy to manage per-user images
- Can implement cleanup for deleted users
- Scalable structure

## User Flow

1. **User navigates to Settings page**
2. **Sees Profile Image section** with:
   - Current image preview (if exists)
   - File upload area
   - Optional URL input
3. **User clicks or drags image** to upload area
4. **File is validated** (type, size)
5. **Image uploads to Cloudinary** automatically
6. **Preview updates** with new image
7. **Image URL is set** in form data
8. **User clicks Save Changes** to persist
9. **Profile updates** with new image URL

## Validation

### Client-Side Validation
- File type: Only image files (`image/*`)
- File size: Maximum 5MB
- Visual feedback during upload

### Server-Side Validation
- Authentication check
- File type validation
- File size validation (5MB max)
- Cloudinary upload validation

## Error Handling

**Client-Side:**
- File type errors → Toast notification
- File size errors → Toast notification
- Upload errors → Toast notification + error state

**Server-Side:**
- Authentication errors → 401 Unauthorized
- Validation errors → 400 Bad Request
- Upload errors → 500 Internal Server Error

## Translations

All UI text is translatable:
- "Profile Image" → `t('common.profile') + ' ' + t('content.image')`
- "Upload Profile Image" → `t('content.uploadFile')`
- "Save Changes" → `t('common.saveChanges')`
- Error messages → Translations
- Success messages → Translations

## Security Features

1. **Authentication Required**: Only authenticated users can upload
2. **User Isolation**: Images stored per user ID
3. **File Type Validation**: Only images allowed
4. **File Size Limit**: Prevents abuse (5MB max)
5. **Cloudinary Security**: Uses secure URLs

## Testing Checklist

- [x] File upload works
- [x] Image preview displays correctly
- [x] Remove image button works
- [x] URL fallback still works
- [x] File validation works (type, size)
- [x] Error handling works
- [x] Success notifications appear
- [x] Profile saves correctly
- [x] Image persists after page refresh
- [x] Translations work
- [x] Works for all user roles

## Future Enhancements (Optional)

1. **Image Cropping**: Add image cropping before upload
2. **Image Optimization**: Automatic optimization on upload
3. **Multiple Sizes**: Generate multiple sizes (thumbnail, medium, large)
4. **Image History**: Keep history of uploaded images
5. **Default Avatars**: Provide default avatars if no image
6. **Bulk Upload**: Allow uploading multiple images (for admins)

## Technical Details

### File Upload Flow

1. User selects file → `handleImageUpload` called
2. File validated (type, size)
3. FormData created with file
4. POST request to `/api/settings/profile/upload-image`
5. Server validates and uploads to Cloudinary
6. Response contains image URL
7. Form data updated with URL
8. Preview updated
9. Toast notification shown

### Image Preview

- Uses Next.js `Image` component
- Circular display (rounded-full)
- 128x128px size
- Object-fit: cover
- Border styling
- Remove button overlay

### Cloudinary Integration

- Uses existing `cloudinaryStorage.uploadImage` method
- Stores in organized folder structure
- Returns optimized URLs
- Generates thumbnails automatically

## Benefits

1. **User-Friendly**: Direct upload instead of URL entry
2. **Organized Storage**: Cloudinary folder structure
3. **Automatic Optimization**: Cloudinary handles optimization
4. **Scalable**: Can handle many users
5. **Secure**: Authentication and validation
6. **Flexible**: Still supports URL input as fallback
7. **Translated**: Full translation support

## Usage

Users can now:
1. Click "Upload Profile Image" or drag-and-drop
2. Select an image file (JPG, PNG, WebP)
3. See preview immediately
4. Remove image if needed
5. Or paste URL as fallback
6. Save changes to update profile

The image is automatically uploaded to Cloudinary and the URL is saved to the user's profile.

