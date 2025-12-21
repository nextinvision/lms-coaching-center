// Cloudinary Storage Service for All File Types
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryResourceType = 'image' | 'raw' | 'video' | 'auto';

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    thumbnailUrl?: string;
    format?: string;
    bytes?: number;
}

export const cloudinaryStorage = {
    /**
     * Upload file to Cloudinary (supports images, PDFs, videos)
     */
    async uploadFile(
        file: File,
        folder: string,
        resourceType: CloudinaryResourceType = 'auto'
    ): Promise<CloudinaryUploadResult> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Determine resource type from file if auto
            let finalResourceType: CloudinaryResourceType = resourceType;
            if (resourceType === 'auto') {
                if (file.type.startsWith('image/')) {
                    finalResourceType = 'image';
                } else if (file.type.startsWith('video/')) {
                    finalResourceType = 'video';
                } else {
                    finalResourceType = 'raw'; // For PDFs and other files
                }
            }

            const uploadOptions: {
                folder: string;
                resource_type: CloudinaryResourceType;
                transformation?: Array<Record<string, unknown>>;
            } = {
                folder: `lms/${folder}`,
                resource_type: finalResourceType,
            };

            // Add transformations for images
            if (finalResourceType === 'image') {
                uploadOptions.transformation = [
                    { width: 1200, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ];
            }

            // Add transformations for videos
            if (finalResourceType === 'video') {
                uploadOptions.transformation = [
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ];
            }

            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(uploadOptions, (error, result) => {
                        if (error) {
                            reject(new Error(`Failed to upload file: ${error.message}`));
                        } else if (result) {
                            const response: CloudinaryUploadResult = {
                                url: result.secure_url,
                                publicId: result.public_id,
                                format: result.format,
                                bytes: result.bytes,
                            };

                            // Generate thumbnail for images and videos
                            if (finalResourceType === 'image' || finalResourceType === 'video') {
                                response.thumbnailUrl = cloudinary.url(result.public_id, {
                                    resource_type: finalResourceType,
                                    transformation: [{ width: 300, height: 300, crop: 'fill' }],
                                });
                            }

                            resolve(response);
                        }
                    })
                    .end(buffer);
            });
        } catch (error) {
            throw new Error(`Failed to process file: ${(error as Error).message}`);
        }
    },

    /**
     * Upload image to Cloudinary
     */
    async uploadImage(
        file: File,
        folder: string
    ): Promise<{ url: string; publicId: string; thumbnailUrl: string }> {
        const result = await this.uploadFile(file, folder, 'image');
        return {
            url: result.url,
            publicId: result.publicId,
            thumbnailUrl: result.thumbnailUrl || result.url,
        };
    },

    /**
     * Upload PDF to Cloudinary
     */
    async uploadPDF(
        file: File,
        folder: string
    ): Promise<{ url: string; publicId: string }> {
        const result = await this.uploadFile(file, folder, 'raw');
        return {
            url: result.url,
            publicId: result.publicId,
        };
    },

    /**
     * Upload video to Cloudinary
     */
    async uploadVideo(
        file: File,
        folder: string
    ): Promise<{ url: string; publicId: string; thumbnailUrl: string }> {
        const result = await this.uploadFile(file, folder, 'video');
        return {
            url: result.url,
            publicId: result.publicId,
            thumbnailUrl: result.thumbnailUrl || result.url,
        };
    },

    /**
     * Delete file from Cloudinary
     */
    async deleteFile(publicId: string, resourceType: CloudinaryResourceType = 'image'): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType,
            });
        } catch (error) {
            throw new Error(`Failed to delete file: ${(error as Error).message}`);
        }
    },

    /**
     * Delete image from Cloudinary (backward compatibility)
     */
    async deleteImage(publicId: string): Promise<void> {
        await this.deleteFile(publicId, 'image');
    },

    /**
     * Get optimized image URL
     */
    getOptimizedUrl(
        publicId: string,
        options: {
            width?: number;
            height?: number;
            crop?: string;
            quality?: string;
        } = {}
    ): string {
        return cloudinary.url(publicId, {
            transformation: [
                { quality: options.quality || 'auto' },
                { fetch_format: 'auto' },
                ...(options.width ? [{ width: options.width }] : []),
                ...(options.height ? [{ height: options.height }] : []),
                ...(options.crop ? [{ crop: options.crop }] : []),
            ],
        });
    },

    /**
     * Get thumbnail URL
     */
    getThumbnailUrl(publicId: string, size: number = 300): string {
        return cloudinary.url(publicId, {
            transformation: [
                { width: size, height: size, crop: 'fill' },
                { quality: 'auto' },
            ],
        });
    },
};

export default cloudinaryStorage;
