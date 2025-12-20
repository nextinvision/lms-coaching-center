import React from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import Link from 'next/link';
import Card from '../ui/Card';

interface ContentCardProps {
    content: {
        id: string;
        title: string;
        description?: string;
        type: 'PDF' | 'IMAGE' | 'VIDEO';
        fileUrl: string;
        subject?: {
            name: string;
        };
        chapterName?: string;
        createdAt: string;
    };
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
    // Icon based on content type
    const getTypeIcon = () => {
        switch (content.type) {
            case 'PDF':
                return '📄';
            case 'IMAGE':
                return '🖼️';
            case 'VIDEO':
                return '🎥';
            default:
                return '📁';
        }
    };

    return (
        <Link href={`/content/${content.id}`}>
            <Card hoverable className="overflow-hidden">
                {/* Thumbnail or placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                    <span className="text-6xl">{getTypeIcon()}</span>
                </div>

                {/* Content details */}
                <div className="p-4 text-left">
                    {/* Type badge */}
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {content.type}
                    </span>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                        {content.title}
                    </h3>

                    {/* Subject and Chapter */}
                    <div className="text-sm text-gray-600 mb-2">
                        {content.subject && <span className="font-medium">{content.subject.name}</span>}
                        {content.chapterName && (
                            <>
                                <span className="mx-1">•</span>
                                <span>{content.chapterName}</span>
                            </>
                        )}
                    </div>

                    {/* Date */}
                    <p className="text-xs text-gray-500">
                        Added {new Date(content.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </Card>
        </Link>
    );
};

export default ContentCard;
