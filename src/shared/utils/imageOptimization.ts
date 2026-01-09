// Image Optimization Utilities
export interface ImageOptimizationOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
}

/**
 * Generate optimized image URL
 * For MinIO, we return the URL as-is since image optimization
 * would require additional processing (can be enhanced later)
 */
export function getOptimizedImageUrl(
    imageUrl: string,
    options: ImageOptimizationOptions = {}
): string {
    // For MinIO URLs, return as-is
    // In production, you might want to integrate with an image processing service
    // or use Next.js Image component with external image optimization
    return imageUrl;
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

