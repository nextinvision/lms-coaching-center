// File Viewer Component (Routes to appropriate viewer)
'use client';

import React from 'react';
import { PDFViewer } from './PDFViewer';
import { VideoPlayer } from './VideoPlayer';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { downloadImage, extractFilenameFromUrl } from '@/core/utils/fileDownload';
import Image from 'next/image';
import type { Content } from '../types/content.types';

interface FileViewerProps {
    content: Content;
}

export function FileViewer({ content }: FileViewerProps) {
    switch (content.type) {
        case 'PDF':
            return (
                <PDFViewer
                    fileUrl={content.fileUrl}
                    fileName={content.fileName || content.title}
                    isDownloadable={content.isDownloadable}
                />
            );

        case 'IMAGE':
            return (
                <Card>
                    <CardContent className="p-0">
                        <div className="relative w-full h-auto">
                            <Image
                                src={content.fileUrl}
                                alt={content.title}
                                width={1200}
                                height={800}
                                className="w-full h-auto rounded-lg"
                                unoptimized
                            />
                        </div>
                        {content.isDownloadable && (
                            <div className="p-4 border-t">
                                <button
                                    onClick={async () => {
                                        try {
                                            const filename = content.fileName || extractFilenameFromUrl(content.fileUrl, content.title);
                                            const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
                                            const imageType = extension === 'png' ? 'png' : extension === 'webp' ? 'webp' : extension === 'gif' ? 'gif' : 'jpeg';
                                            await downloadImage(content.fileUrl, filename.replace(/\.[^.]+$/, ''), imageType);
                                        } catch (error) {
                                            console.error('Download failed:', error);
                                        }
                                    }}
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    Download Image
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            );

        case 'VIDEO':
            return <VideoPlayer videoUrl={content.fileUrl} title={content.title} />;

        default:
            return (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-600">Unsupported file type</p>
                    </CardContent>
                </Card>
            );
    }
}

export default FileViewer;

