// Video Player Component (YouTube)
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { ExternalLink } from 'lucide-react';
import { youtubeUtils } from '@/core/storage/youtube';

interface VideoPlayerProps {
    videoUrl: string;
    title?: string;
}

export function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
    const videoInfo = youtubeUtils.getVideoInfo(videoUrl);

    if (!videoInfo.isValid || !videoInfo.embedUrl) {
        return (
            <Card>
                <CardContent className="py-12 text-center">
                    <p className="text-red-600 mb-4">Invalid YouTube URL</p>
                    <Button
                        onClick={() => window.open(videoUrl, '_blank')}
                        variant="outline"
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Video
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title || 'Video'}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        src={videoInfo.embedUrl}
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={title || 'Video'}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default VideoPlayer;

