// Legacy Cloudinary export - now uses MinIO for backward compatibility
// This file provides backward compatibility for existing code
// New code should import from '@/core/storage/minio' directly
import { minioStorage } from '@/core/storage/minio'

// Legacy function wrappers for backward compatibility
export async function uploadFile(
  file: File | Buffer,
  folder: string = 'lms-content'
): Promise<{ url: string; publicId: string }> {
  if (file instanceof File) {
    const result = await minioStorage.uploadImage(file, folder)
    return {
      url: result.url,
      publicId: result.path,
    }
  } else {
    // Convert Buffer to File
    const fileObj = new File([new Uint8Array(file)], 'upload', { type: 'application/octet-stream' })
    const result = await minioStorage.uploadFile(fileObj, `${folder}/upload`, 'application/octet-stream')
    return {
      url: result.url,
      publicId: result.path,
    }
  }
}

export async function deleteFile(publicId: string) {
  await minioStorage.deleteFile(publicId)
}
