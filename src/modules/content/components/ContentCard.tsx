// Content Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Content } from '../types/content.types';
import { FileText, Image as ImageIcon, Video, Download } from 'lucide-react';
import { downloadPDF, downloadImage, extractFilenameFromUrl } from '@/core/utils/fileDownload';

interface ContentCardProps {
    content: Content;
    onClick?: () => void;
    showDownload?: boolean;
}

export function ContentCard({ content, onClick, showDownload = true }: ContentCardProps) {
    const getTypeIcon = () => {
        switch (content.type) {
            case 'PDF':
                return <FileText className="h-8 w-8 text-red-600" />;
            case 'IMAGE':
                return <ImageIcon className="h-8 w-8 text-blue-600" />;
            case 'VIDEO':
                return <Video className="h-8 w-8 text-purple-600" />;
            default:
                return <FileText className="h-8 w-8 text-gray-600" />;
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!content.isDownloadable || !content.fileUrl) return;

        try {
            const filename = content.fileName || extractFilenameFromUrl(content.fileUrl, content.title);

            if (content.type === 'PDF') {
                await downloadPDF(content.fileUrl, filename);
            } else if (content.type === 'IMAGE') {
                // Determine image type from URL or default to jpeg
                const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
                const imageType = extension === 'png' ? 'png' : extension === 'webp' ? 'webp' : extension === 'gif' ? 'gif' : 'jpeg';
                await downloadImage(content.fileUrl, filename.replace(/\.[^.]+$/, ''), imageType);
            } else {
                // For videos or other types, use generic download
                const { downloadFile } = await import('@/core/utils/fileDownload');
                await downloadFile(content.fileUrl, filename);
            }
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab if download fails
            window.open(content.fileUrl, '_blank');
        }
    };

    return (
        <Card
            className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="shrink-0">{getTypeIcon()}</div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{content.title}</CardTitle>
                            {content.chapterName && (
                                <p className="text-sm text-gray-600 mt-1">{content.chapterName}</p>
                            )}
                        </div>
                    </div>
                    {showDownload && content.isDownloadable && (
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                        >
                            <Download className="h-4 w-4 text-gray-600" />
                        </button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {content.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{content.description}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="info">{content.type}</Badge>
                        <Badge variant={content.language === 'EN' ? 'default' : 'success'}>
                            {content.language}
                        </Badge>
                        {content.subject && (
                            <Badge variant="default">{content.subject.name}</Badge>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        Uploaded {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default ContentCard;

