// File Upload Utilities
import { supabaseStorage } from './supabase';
import { cloudinaryStorage } from './cloudinary';
import { youtubeUtils } from './youtube';

export type FileType = 'PDF' | 'IMAGE' | 'VIDEO';

export interface UploadResult {
    type: FileType;
    url: string;
    fileId: string;
    fileName?: string;
    fileSize?: number;
    thumbnailUrl?: string;
}

export const fileUpload = {
    /**
     * Upload file based on type
     */
    async upload(
        file: File,
        type: FileType,
        metadata: {
            batchId: string;
            subjectId?: string;
            chapter?: string;
        }
    ): Promise<UploadResult> {
        switch (type) {
            case 'PDF':
                return this.uploadPDF(file, metadata);
            case 'IMAGE':
                return this.uploadImage(file, metadata);
            default:
                throw new Error(`Unsupported file type: ${type}`);
        }
    },

    /**
     * Upload PDF to Supabase
     */
    async uploadPDF(
        file: File,
        metadata: { batchId: string; subjectId?: string; chapter?: string }
    ): Promise<UploadResult> {
        const path = this.generatePDFPath(file.name, metadata);
        const result = await supabaseStorage.uploadPDF(file, path);

        return {
            type: 'PDF',
            url: result.url,
            fileId: result.path,
            fileName: file.name,
            fileSize: file.size,
        };
    },

    /**
     * Upload Image to Cloudinary
     */
    async uploadImage(
        file: File,
        metadata: { batchId: string; subjectId?: string }
    ): Promise<UploadResult> {
        const folder = `content/batch-${metadata.batchId}${metadata.subjectId ? `/subject-${metadata.subjectId}` : ''
            }`;

        const result = await cloudinaryStorage.uploadImage(file, folder);

        return {
            type: 'IMAGE',
            url: result.url,
            fileId: result.publicId,
            fileName: file.name,
            fileSize: file.size,
            thumbnailUrl: result.thumbnailUrl,
        };
    },

    /**
     * Process YouTube video URL
     */
    processYouTubeVideo(url: string): UploadResult {
        const videoInfo = youtubeUtils.getVideoInfo(url);

        if (!videoInfo.isValid || !videoInfo.videoId) {
            throw new Error('Invalid YouTube URL');
        }

        return {
            type: 'VIDEO',
            url: videoInfo.embedUrl!,
            fileId: videoInfo.videoId,
            thumbnailUrl: videoInfo.thumbnailUrl!,
        };
    },

    /**
     * Generate PDF storage path
     */
    generatePDFPath(
        fileName: string,
        metadata: { batchId: string; subjectId?: string; chapter?: string }
    ): string {
        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');

        let path = `batch-${metadata.batchId}`;

        if (metadata.subjectId) {
            path += `/subject-${metadata.subjectId}`;
        }

        if (metadata.chapter) {
            path += `/chapter-${metadata.chapter.replace(/[^a-zA-Z0-9-]/g, '_')}`;
        }

        path += `/${timestamp}-${sanitizedFileName}`;

        return path;
    },

    /**
     * Validate file type
     */
    validateFileType(file: File, expectedType: FileType): boolean {
        const mimeTypes: Record<FileType, string[]> = {
            PDF: ['application/pdf'],
            IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            VIDEO: [], // Not used for file uploads
        };

        return mimeTypes[expectedType].includes(file.type);
    },

    /**
     * Validate file size (in MB)
     */
    validateFileSize(file: File, maxSizeMB: number): boolean {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return file.size <= maxSizeBytes;
    },
};

export default fileUpload;
