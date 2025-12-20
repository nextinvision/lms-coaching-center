// Cloudinary Storage Service for Images
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryStorage = {
    /**
     * Upload image to Cloudinary
     */
    async uploadImage(
        file: File,
        folder: string
    ): Promise<{ url: string; publicId: string; thumbnailUrl: string }> {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: `lms/${folder}`,
                            resource_type: 'image',
                            transformation: [
                                { width: 1200, crop: 'limit' },
                                { quality: 'auto' },
                                { fetch_format: 'auto' },
                            ],
                        },
                        (error, result) => {
                            if (error) {
                                reject(new Error(`Failed to upload image: ${error.message}`));
                            } else if (result) {
                                resolve({
                                    url: result.secure_url,
                                    publicId: result.public_id,
                                    thumbnailUrl: cloudinary.url(result.public_id, {
                                        transformation: [{ width: 300, height: 300, crop: 'fill' }],
                                    }),
                                });
                            }
                        }
                    )
                    .end(buffer);
            });
        } catch (error) {
            throw new Error(`Failed to process image: ${(error as Error).message}`);
        }
    },

    /**
     * Delete image from Cloudinary
     */
    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            throw new Error(`Failed to delete image: ${(error as Error).message}`);
        }
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
