// YouTube Video Utilities
export const youtubeUtils = {
    /**
     * Extract video ID from YouTube URL
     * Supports multiple YouTube URL formats:
     * - https://www.youtube.com/watch?v=VIDEO_ID
     * - https://youtu.be/VIDEO_ID
     * - https://www.youtube.com/embed/VIDEO_ID
     * - https://www.youtube.com/v/VIDEO_ID
     * - https://m.youtube.com/watch?v=VIDEO_ID
     * - https://youtube.com/watch?v=VIDEO_ID (without www)
     */
    extractVideoId(url: string): string | null {
        if (!url || typeof url !== 'string') {
            return null;
        }

        // Clean the URL - remove whitespace
        const cleanUrl = url.trim();

        // Comprehensive patterns for all YouTube URL formats
        const patterns = [
            // Standard watch URL: youtube.com/watch?v=VIDEO_ID
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
            // Mobile URL: m.youtube.com/watch?v=VIDEO_ID
            /m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            // Short URL: youtu.be/VIDEO_ID
            /youtu\.be\/([a-zA-Z0-9_-]{11})/,
            // Embed URL: youtube.com/embed/VIDEO_ID
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            // Direct video URL: youtube.com/v/VIDEO_ID
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            // URL with additional parameters
            /[?&]v=([a-zA-Z0-9_-]{11})/,
        ];

        for (const pattern of patterns) {
            const match = cleanUrl.match(pattern);
            if (match && match[1] && match[1].length === 11) {
                return match[1];
            }
        }

        // Fallback: try to extract 11-character video ID directly
        const directMatch = cleanUrl.match(/([a-zA-Z0-9_-]{11})/);
        if (directMatch && directMatch[1] && (cleanUrl.includes('youtube') || cleanUrl.includes('youtu.be'))) {
            return directMatch[1];
        }

        return null;
    },

    /**
     * Generate embed URL from video ID
     */
    getEmbedUrl(videoId: string): string {
        return `https://www.youtube.com/embed/${videoId}`;
    },

    /**
     * Validate YouTube URL
     */
    isValidYouTubeUrl(url: string): boolean {
        return this.extractVideoId(url) !== null;
    },

    /**
     * Get thumbnail URL
     */
    getThumbnailUrl(
        videoId: string,
        quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'
    ): string {
        const qualityMap = {
            default: 'default',
            hq: 'hqdefault',
            mq: 'mqdefault',
            sd: 'sddefault',
            maxres: 'maxresdefault',
        };

        return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
    },

    /**
     * Get video info (basic)
     */
    getVideoInfo(url: string): {
        videoId: string | null;
        embedUrl: string | null;
        thumbnailUrl: string | null;
        isValid: boolean;
    } {
        const videoId = this.extractVideoId(url);

        if (!videoId) {
            return {
                videoId: null,
                embedUrl: null,
                thumbnailUrl: null,
                isValid: false,
            };
        }

        return {
            videoId,
            embedUrl: this.getEmbedUrl(videoId),
            thumbnailUrl: this.getThumbnailUrl(videoId),
            isValid: true,
        };
    },

    /**
     * Generate iframe HTML
     */
    generateIframeHtml(
        videoId: string,
        options: {
            width?: number | string;
            height?: number | string;
            autoplay?: boolean;
            controls?: boolean;
        } = {}
    ): string {
        const {
            width = '100%',
            height = '100%',
            autoplay = false,
            controls = true,
        } = options;

        const params = new URLSearchParams({
            autoplay: autoplay ? '1' : '0',
            controls: controls ? '1' : '0',
        });

        return `<iframe 
      width="${width}" 
      height="${height}" 
      src="https://www.youtube.com/embed/${videoId}?${params.toString()}" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
    ></iframe>`;
    },
};

export default youtubeUtils;
