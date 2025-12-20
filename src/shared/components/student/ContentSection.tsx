'use client';

import React from 'react';
import Link from 'next/link';
import ContentCard from './ContentCard';

// This would be fetched from API in real implementation
interface Content {
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
}

interface ContentSectionProps {
    contents?: Content[];
    title?: string;
    description?: string;
    showAllLink?: boolean;
}

const ContentSection: React.FC<ContentSectionProps> = ({
    contents = [],
    title = 'Recent Content',
    description = 'Discover the latest study materials and resources uploaded by your teachers. From comprehensive notes to practice exercises, access everything you need to excel.',
    showAllLink = true,
}) => {
    return (
        <div className="py-16 md:px-40 px-8">
            <h2 className="text-3xl font-medium text-gray-800">{title}</h2>
            <p className="text-sm md:text-base text-gray-500 mt-3">
                {description}
            </p>

            {contents.length > 0 ? (
                <>
                    <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
                        {contents.slice(0, 4).map((content) => (
                            <ContentCard key={content.id} content={content} />
                        ))}
                    </div>

                    {showAllLink && (
                        <Link
                            href="/content"
                            onClick={() => window.scrollTo(0, 0)}
                            className="inline-block text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-50 transition-colors"
                        >
                            View All Content
                        </Link>
                    )}
                </>
            ) : (
                <div className="text-center py-16 text-gray-500">
                    <p>No content available at the moment.</p>
                    <p className="text-sm mt-2">Check back later for new study materials.</p>
                </div>
            )}
        </div>
    );
};

export default ContentSection;
