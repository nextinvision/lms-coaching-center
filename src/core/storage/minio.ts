// MinIO Storage Service for All File Types
import * as MinIO from 'minio';

// Initialize MinIO client
const minioClient = new MinIO.Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'lms-storage';
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || 'http://localhost:9000';

export interface MinIOUploadResult {
    url: string;
    path: string;
    fileName: string;
    fileSize?: number;
    thumbnailUrl?: string;
}

/**
 * Ensure bucket exists
 */
async function ensureBucket(): Promise<void> {
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        
        // Set bucket policy for public read access
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
                },
            ],
        };
        
        try {
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
        } catch (error) {
            console.warn('Could not set bucket policy:', error);
        }
    }
}

/**
 * Initialize bucket on module load
 */
ensureBucket().catch(console.error);

export const minioStorage = {
    /**
     * Upload file to MinIO
     */
    async uploadFile(
        file: File | Buffer,
        path: string,
        contentType?: string
    ): Promise<MinIOUploadResult> {
        try {
            await ensureBucket();

            const isBuffer = Buffer.isBuffer(file);
            const buffer = isBuffer ? file : Buffer.from(await file.arrayBuffer());
            const fileName = isBuffer ? path.split('/').pop() || 'file' : file.name;
            const fileSize = isBuffer ? buffer.length : file.size;
            const mimeType = contentType || (isBuffer ? 'application/octet-stream' : file.type);

            const objectName = path.startsWith('/') ? path.slice(1) : path;

            await minioClient.putObject(BUCKET_NAME, objectName, buffer, buffer.length, {
                'Content-Type': mimeType,
            });

            // Generate public URL
            const url = `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${objectName}`;

            return {
                url,
                path: objectName,
                fileName,
                fileSize,
            };
        } catch (error) {
            throw new Error(`Failed to upload file to MinIO: ${(error as Error).message}`);
        }
    },

    /**
     * Upload image to MinIO
     */
    async uploadImage(
        file: File,
        folder: string
    ): Promise<{ url: string; path: string; thumbnailUrl?: string }> {
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const objectName = `images/${folder}/${timestamp}-${sanitizedFileName}`;

        const result = await this.uploadFile(file, objectName, file.type);

        // For thumbnails, we can use the same image (in production, you might want to generate actual thumbnails)
        return {
            url: result.url,
            path: result.path,
            thumbnailUrl: result.url, // Using same URL for now, can be enhanced later
        };
    },

    /**
     * Upload PDF to MinIO
     */
    async uploadPDF(
        file: File,
        folder: string
    ): Promise<{ url: string; path: string }> {
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const objectName = `pdfs/${folder}/${timestamp}-${sanitizedFileName}`;

        const result = await this.uploadFile(file, objectName, 'application/pdf');

        return {
            url: result.url,
            path: result.path,
        };
    },

    /**
     * Upload video to MinIO
     */
    async uploadVideo(
        file: File,
        folder: string
    ): Promise<{ url: string; path: string; thumbnailUrl?: string }> {
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const objectName = `videos/${folder}/${timestamp}-${sanitizedFileName}`;

        const result = await this.uploadFile(file, objectName, file.type);

        return {
            url: result.url,
            path: result.path,
            thumbnailUrl: result.url, // Placeholder - can be enhanced to extract video thumbnail
        };
    },

    /**
     * Get public URL for a file
     */
    getPublicUrl(path: string): string {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${MINIO_PUBLIC_URL}/${BUCKET_NAME}/${cleanPath}`;
    },

    /**
     * Delete file from MinIO
     */
    async deleteFile(path: string): Promise<void> {
        try {
            const objectName = path.startsWith('/') ? path.slice(1) : path;
            await minioClient.removeObject(BUCKET_NAME, objectName);
        } catch (error) {
            throw new Error(`Failed to delete file from MinIO: ${(error as Error).message}`);
        }
    },

    /**
     * Download file from MinIO
     */
    async downloadFile(path: string): Promise<Buffer> {
        try {
            const objectName = path.startsWith('/') ? path.slice(1) : path;
            const chunks: Buffer[] = [];
            const stream = await minioClient.getObject(BUCKET_NAME, objectName);

            return new Promise((resolve, reject) => {
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', reject);
            });
        } catch (error) {
            throw new Error(`Failed to download file from MinIO: ${(error as Error).message}`);
        }
    },

    /**
     * List files in a directory
     */
    async listFiles(prefix: string): Promise<any[]> {
        try {
            const cleanPrefix = prefix.startsWith('/') ? prefix.slice(1) : prefix;
            const objectsList: any[] = [];
            const stream = minioClient.listObjects(BUCKET_NAME, cleanPrefix, true);

            return new Promise((resolve, reject) => {
                stream.on('data', (obj) => objectsList.push(obj));
                stream.on('end', () => resolve(objectsList));
                stream.on('error', reject);
            });
        } catch (error) {
            throw new Error(`Failed to list files from MinIO: ${(error as Error).message}`);
        }
    },

    /**
     * Get optimized image URL (for MinIO, we return the same URL for now)
     * Can be enhanced with image processing if needed
     */
    getOptimizedUrl(
        path: string,
        options: {
            width?: number;
            height?: number;
            crop?: string;
            quality?: string;
        } = {}
    ): string {
        // For now, return the same URL
        // In production, you might want to integrate with an image processing service
        // or use MinIO's built-in features if available
        return this.getPublicUrl(path);
    },

    /**
     * Get thumbnail URL
     */
    getThumbnailUrl(path: string, size: number = 300): string {
        // For now, return the same URL
        // Can be enhanced with actual thumbnail generation
        return this.getPublicUrl(path);
    },
};

export default minioStorage;

