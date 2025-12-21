// File Download Utility
// Properly downloads files with correct filename and format

/**
 * Download a file with proper filename and format
 */
export async function downloadFile(
    url: string,
    filename: string,
    options?: {
        mimeType?: string;
        onProgress?: (progress: number) => void;
    }
): Promise<void> {
    try {
        // Fetch the file
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        // Get the blob
        const blob = await response.blob();

        // Create object URL
        const objectUrl = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        
        // Set MIME type if provided
        if (options?.mimeType) {
            link.type = options.mimeType;
        }

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up object URL after a delay
        setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
        }, 100);
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}

/**
 * Download PDF file with proper filename
 */
export async function downloadPDF(url: string, filename: string): Promise<void> {
    // Ensure filename has .pdf extension
    const pdfFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    await downloadFile(url, pdfFilename, { mimeType: 'application/pdf' });
}

/**
 * Download image file with proper filename and extension
 */
export async function downloadImage(
    url: string,
    filename: string,
    imageType: 'jpeg' | 'png' | 'webp' | 'gif' = 'jpeg'
): Promise<void> {
    // Ensure filename has correct extension
    const extension = imageType === 'jpeg' ? 'jpg' : imageType;
    const imageFilename = filename.endsWith(`.${extension}`)
        ? filename
        : `${filename}.${extension}`;
    
    await downloadFile(url, imageFilename, { mimeType: `image/${imageType}` });
}

/**
 * Get file extension from URL or filename
 */
export function getFileExtension(urlOrFilename: string): string {
    const match = urlOrFilename.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : '';
}

/**
 * Extract filename from URL
 */
export function extractFilenameFromUrl(url: string, fallback: string = 'download'): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split('/').pop() || fallback;
        
        // Remove query parameters from filename
        return filename.split('?')[0] || fallback;
    } catch {
        // If URL parsing fails, try to extract from path
        const match = url.match(/\/([^\/\?]+)(?:\?|$)/);
        return match ? match[1] : fallback;
    }
}

