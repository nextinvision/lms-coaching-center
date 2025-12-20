# Storage Strategy & Configuration

## Overview

The LMS uses a **multi-provider storage strategy** for optimal performance and cost-efficiency:

- **Supabase Storage**: PDF documents and files
- **Cloudinary**: Images (optimized delivery via CDN)
- **YouTube**: Recorded video lectures (unlisted videos)

---

## 1. Supabase Storage (PDFs)

### Purpose
Store PDF notes, documents, and study materials.

### Configuration
```typescript
// src/core/storage/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseStorage = {
  async uploadPDF(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(path, file);
    
    if (error) throw error;
    return data;
  },

  async getPublicUrl(path: string) {
    const { data } = supabase.storage
      .from('pdfs')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  async deletePDF(path: string) {
    const { error } = await supabase.storage
      .from('pdfs')
      .remove([path]);
    
    if (error) throw error;
  }
};
```

### Folder Structure
```
pdfs/
├── batch-{batchId}/
│   ├── subject-{subjectId}/
│   │   ├── chapter-1/
│   │   │   ├── notes-1.pdf
│   │   │   └── notes-2.pdf
│   │   └── chapter-2/
│   │       └── notes-1.pdf
```

---

## 2. Cloudinary (Images)

### Purpose
Store and optimize images (diagrams, handwritten notes, photos).

### Configuration
```typescript
// src/core/storage/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = {
  async uploadImage(file: File, folder: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `lms/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
  },

  async deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  },

  getOptimizedUrl(publicId: string, options = {}) {
    return cloudinary.url(publicId, {
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        ...options
      ]
    });
  }
};
```

### Folder Structure
```
lms/
├── content/
│   ├── batch-{batchId}/
│   │   ├── subject-{subjectId}/
│   │   │   └── image-{timestamp}.jpg
├── profiles/
│   └── student-{studentId}.jpg
└── notices/
    └── notice-{noticeId}.jpg
```

### Benefits
- ✅ Automatic image optimization
- ✅ CDN delivery (fast loading)
- ✅ Responsive images
- ✅ Format conversion (WebP, AVIF)

---

## 3. YouTube (Videos)

### Purpose
Embed pre-recorded lecture videos using YouTube unlisted links.

### Implementation
```typescript
// src/core/storage/youtube.ts

export const youtubeUtils = {
  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  },

  /**
   * Generate embed URL
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  },

  /**
   * Validate YouTube URL
   */
  isValidYouTubeUrl(url: string): boolean {
    return this.extractVideoId(url) !== null;
  },

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(videoId: string, quality: 'default' | 'hq' | 'maxres' = 'hq'): string {
    return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
  }
};
```

### Usage in Content Upload
```typescript
// Teacher uploads video by pasting YouTube URL
const videoUrl = "https://www.youtube.com/watch?v=VIDEO_ID";
const videoId = youtubeUtils.extractVideoId(videoUrl);

// Store only the video ID in database
await contentService.create({
  type: 'VIDEO',
  videoId: videoId,
  videoUrl: youtubeUtils.getEmbedUrl(videoId),
  // ... other fields
});
```

### Video Player Component
```typescript
// src/modules/content/components/VideoPlayer.tsx
export function VideoPlayer({ videoId }: { videoId: string }) {
  const embedUrl = youtubeUtils.getEmbedUrl(videoId);

  return (
    <div className="aspect-video w-full">
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

### Benefits
- ✅ No video hosting costs
- ✅ Unlimited bandwidth
- ✅ Professional video player
- ✅ Unlisted = Private but shareable

---

## 4. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# YouTube (no API key needed for embeds)
```

---

## 5. Content Service Integration

```typescript
// src/modules/content/services/contentService.ts
import { supabaseStorage } from '@/core/storage/supabase';
import { cloudinaryStorage } from '@/core/storage/cloudinary';
import { youtubeUtils } from '@/core/storage/youtube';

export const contentService = {
  async uploadContent(file: File, type: ContentType, metadata: any) {
    let fileUrl: string;
    let fileId: string;

    switch (type) {
      case 'PDF':
        const pdfPath = `batch-${metadata.batchId}/subject-${metadata.subjectId}/${file.name}`;
        await supabaseStorage.uploadPDF(file, pdfPath);
        fileUrl = await supabaseStorage.getPublicUrl(pdfPath);
        fileId = pdfPath;
        break;

      case 'IMAGE':
        const folder = `content/batch-${metadata.batchId}/subject-${metadata.subjectId}`;
        const result = await cloudinaryStorage.uploadImage(file, folder);
        fileUrl = result.secure_url;
        fileId = result.public_id;
        break;

      case 'VIDEO':
        // Teacher pastes YouTube URL
        const videoId = youtubeUtils.extractVideoId(metadata.videoUrl);
        if (!videoId) throw new Error('Invalid YouTube URL');
        fileUrl = youtubeUtils.getEmbedUrl(videoId);
        fileId = videoId;
        break;
    }

    return { fileUrl, fileId };
  }
};
```

---

## 6. Database Schema Update

```prisma
model Content {
  id              String      @id @default(uuid())
  title           String
  type            ContentType
  
  // Storage fields
  fileUrl         String      // Full URL to access file
  fileId          String      // Storage provider ID (path/publicId/videoId)
  fileName        String?     // Original filename (for PDFs)
  fileSize        Int?        // File size in bytes (for PDFs/Images)
  
  // For videos
  videoId         String?     // YouTube video ID
  thumbnailUrl    String?     // Video thumbnail
  
  // ... other fields
}

enum ContentType {
  PDF
  IMAGE
  VIDEO
}
```

---

## 7. Upload Flow

### PDF Upload
1. Teacher selects PDF file
2. Upload to Supabase Storage
3. Get public URL
4. Save to database

### Image Upload
1. Teacher selects image
2. Upload to Cloudinary
3. Get optimized URL
4. Save to database

### Video Upload
1. Teacher records video → uploads to YouTube (unlisted)
2. Teacher copies YouTube URL
3. Paste URL in LMS dashboard
4. Extract video ID
5. Save video ID to database
6. Display using iframe embed

---

## Summary

| Content Type | Storage Provider | Cost | Benefits |
|-------------|------------------|------|----------|
| **PDFs** | Supabase Storage | Low | Integrated with DB |
| **Images** | Cloudinary | Free tier available | CDN, optimization |
| **Videos** | YouTube | Free | Unlimited bandwidth |

This multi-provider approach optimizes for **performance**, **cost**, and **scalability**.
