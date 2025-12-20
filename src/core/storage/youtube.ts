// YouTube Video Utilities
export const youtubeUtils = {
    /**
     * Extract video ID from YouTube URL
     */
    extractVideoId(url: string): string | null {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
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
