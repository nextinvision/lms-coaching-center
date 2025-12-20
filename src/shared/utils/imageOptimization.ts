// Image Optimization Utilities
export interface ImageOptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
}

/**
 * Generate Cloudinary optimized image URL
 */
export function getOptimizedImageUrl(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
): string {
    // If not a Cloudinary URL, return as-is
    if (!imageUrl.includes('cloudinary.com')) {
        return imageUrl;
    }

    const {
        width,
        height,
        quality = 80,
        format = 'auto',
        crop = 'fit',
    } = options;

    // Parse Cloudinary URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const versionIndex = pathParts.findIndex((part) => part.startsWith('v'));
    const publicId = pathParts.slice(versionIndex + 1).join('/').replace(/\.[^/.]+$/, '');

    // Build transformation string
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformationString = transformations.join(',');

    // Reconstruct URL with transformations
    const baseUrl = `${url.protocol}//${url.host}`;
    const version = pathParts[versionIndex] || 'v1';
    const extension = imageUrl.match(/\.[^/.]+$/)?.[0] || '';

    return `${baseUrl}/${transformationString}/${version}/${publicId}${extension}`;
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
    baseUrl: string,
    sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
    return sizes
        .map((size) => `${getOptimizedImageUrl(baseUrl, { width: size })} ${size}w`)
        .join(', ');
}

/**
 * Generate responsive sizes attribute
 */
export function generateSizes(breakpoints: { [key: string]: string } = {}): string {
    const defaultSizes = {
        '(max-width: 640px)': '100vw',
        '(max-width: 1024px)': '50vw',
        default: '33vw',
    };

    const sizes = { ...defaultSizes, ...breakpoints };
    return Object.entries(sizes)
        .map(([query, size]) => (query === 'default' ? size : `${query} ${size}`))
        .join(', ');
}

