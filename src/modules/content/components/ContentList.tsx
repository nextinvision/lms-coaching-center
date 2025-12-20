// Content List Component
'use client';

import React from 'react';
import { useContentByBatch } from '../hooks/useContentByBatch';
import { ContentCard } from './ContentCard';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { useState } from 'react';
import type { ContentType, Language } from '../types/content.types';

interface ContentListProps {
    batchId: string | null;
    onContentClick?: (contentId: string) => void;
    showFilters?: boolean;
}

export function ContentList({ batchId, onContentClick, showFilters = true }: ContentListProps) {
    const { content, isLoading, error } = useContentByBatch(batchId);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<ContentType | ''>('');
    const [languageFilter, setLanguageFilter] = useState<Language | ''>('');

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading content..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    const filteredContent = content?.filter((item) => {
        const matchesSearch =
            !search || item.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = !typeFilter || item.type === typeFilter;
        const matchesLanguage = !languageFilter || item.language === languageFilter;
        return matchesSearch && matchesType && matchesLanguage;
    }) || [];

    if (filteredContent.length === 0 && !isLoading) {
        return (
            <EmptyState
                title="No content found"
                description="There is no content available for this batch."
            />
        );
    }

    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search content..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as ContentType | '')}
                        options={[
                            { label: 'All Types', value: '' },
                            { label: 'PDF', value: 'PDF' },
                            { label: 'Image', value: 'IMAGE' },
                            { label: 'Video', value: 'VIDEO' },
                        ]}
                    />
                    <Select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value as Language | '')}
                        options={[
                            { label: 'All Languages', value: '' },
                            { label: 'English', value: 'EN' },
                            { label: 'Assamese', value: 'AS' },
                        ]}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item) => (
                    <ContentCard
                        key={item.id}
                        content={item}
                        onClick={() => onContentClick?.(item.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ContentList;

