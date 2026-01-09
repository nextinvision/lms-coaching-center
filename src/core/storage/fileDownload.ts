// File Download Utilities
import { minioStorage } from './minio';

export const fileDownload = {
    /**
     * Download file from URL
     */
    async downloadFromUrl(url: string, fileName: string): Promise<void> {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            throw new Error(`Failed to download file: ${(error as Error).message}`);
        }
    },

    /**
     * Download PDF from MinIO
     */
    async downloadPDF(path: string, fileName: string): Promise<void> {
        try {
            const buffer = await minioStorage.downloadFile(path);
            const blob = new Blob([new Uint8Array(buffer)]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error(`Failed to download PDF: ${(error as Error).message}`);
        }
    },

    /**
     * Open file in new tab
     */
    openInNewTab(url: string): void {
        window.open(url, '_blank', 'noopener,noreferrer');
    },

    /**
     * Get file extension from filename
     */
    getFileExtension(fileName: string): string {
        return fileName.split('.').pop()?.toLowerCase() || '';
    },

    /**
     * Format file size
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },
};

export default fileDownload;
