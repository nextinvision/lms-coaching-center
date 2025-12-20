// Test List Component
'use client';

import React, { useState } from 'react';
import { useTestStore } from '../store/testStore';
import { TestCard } from './TestCard';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { useEffect } from 'react';
import type { TestFilters, TestType } from '../types/test.types';

interface TestListProps {
    filters?: TestFilters;
    onTestClick?: (testId: string) => void;
    showFilters?: boolean;
}

export function TestList({ filters, onTestClick, showFilters = true }: TestListProps) {
    const { tests, isLoading, error, setTests, setLoading, setError } = useTestStore();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<TestType | ''>('');

    useEffect(() => {
        fetchTests();
    }, [filters?.batchId, filters?.subjectId, filters?.isActive]);

    const fetchTests = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.subjectId) queryParams.append('subjectId', filters.subjectId);
            if (filters?.isActive !== undefined)
                queryParams.append('isActive', String(filters.isActive));
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/tests?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tests');
            }

            const result = await response.json();
            setTests(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading tests..." />
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

    const filteredTests = tests.filter((test) => {
        const matchesSearch = !search || test.title.toLowerCase().includes(search.toLowerCase());
        const matchesType = !typeFilter || test.type === typeFilter;
        return matchesSearch && matchesType;
    });

    if (filteredTests.length === 0) {
        return (
            <EmptyState
                title="No tests found"
                description="There are no tests available."
            />
        );
    }

    return (
        <div className="space-y-4">
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        placeholder="Search tests..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as TestType | '')}
                        options={[
                            { label: 'All Types', value: '' },
                            { label: 'Practice', value: 'PRACTICE' },
                            { label: 'Weekly', value: 'WEEKLY' },
                            { label: 'Monthly', value: 'MONTHLY' },
                        ]}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTests.map((test) => (
                    <TestCard
                        key={test.id}
                        test={test}
                        onClick={() => onTestClick?.(test.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default TestList;

