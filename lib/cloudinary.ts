// Legacy Cloudinary export - re-exporting from core storage
// This file provides backward compatibility for existing code
// New code should import from '@/core/storage/cloudinary' directly
import { cloudinaryStorage } from '@/core/storage/cloudinary'
import { v2 as cloudinary } from 'cloudinary'

// Re-export cloudinary instance
export { cloudinary }

// Legacy function wrappers for backward compatibility
export async function uploadFile(
  file: File | Buffer,
  folder: string = 'lms-content'
): Promise<{ url: string; publicId: string }> {
  if (file instanceof File) {
    const result = await cloudinaryStorage.uploadImage(file, folder)
    return {
      url: result.url,
      publicId: result.publicId,
    }
  } else {
    // Convert Buffer to File
    const fileObj = new File([new Uint8Array(file)], 'upload', { type: 'application/octet-stream' })
    const result = await cloudinaryStorage.uploadImage(fileObj, folder)
    return {
      url: result.url,
      publicId: result.publicId,
    }
  }
}

export async function deleteFile(publicId: string) {
  await cloudinaryStorage.deleteImage(publicId)
}

