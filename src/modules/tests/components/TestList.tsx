// Test List Component
'use client';

import React, { useState } from 'react';
import { useTestStore } from '../store/testStore';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useEffect } from 'react';
import { Clock, FileText, Calendar, Edit, Eye, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import type { TestFilters, TestType, Test } from '../types/test.types';

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

    const getTypeColor = (type: TestType) => {
        switch (type) {
            case 'PRACTICE':
                return 'info';
            case 'WEEKLY':
                return 'warning';
            case 'MONTHLY':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getStatusBadge = (test: Test) => {
        const isUpcoming = test.startDate && new Date(test.startDate) > new Date();
        const isActive = test.isActive && (!test.startDate || new Date(test.startDate) <= new Date());

        if (isUpcoming) return <Badge variant="info">Upcoming</Badge>;
        if (isActive) return <Badge variant="success">Active</Badge>;
        return <Badge variant="default">Inactive</Badge>;
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

            {/* Table View */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Test Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTests.map((test) => (
                                <tr
                                    key={test.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* Test Details */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {test.title}
                                            </span>
                                            {test.description && (
                                                <span className="text-xs text-gray-600 mt-1 line-clamp-1">
                                                    {test.description}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Type */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Badge variant={getTypeColor(test.type)}>
                                            {test.type}
                                        </Badge>
                                    </td>

                                    {/* Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />
                                                <span>{test.questions?.length || 0} questions</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium">{test.totalMarks} marks</span>
                                            </div>
                                            {test.durationMinutes && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{test.durationMinutes} min</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Schedule */}
                                    <td className="px-6 py-4">
                                        {test.startDate ? (
                                            <div className="flex flex-col gap-1 text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        {new Date(test.startDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {test.endDate && (
                                                    <span className="text-xs">
                                                        to {new Date(test.endDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-600">No schedule</span>
                                        )}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(test)}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/teacher/tests/${test.id}/results`}>
                                                <Button variant="ghost" size="sm" title="View Results">
                                                    <Users className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/teacher/tests/${test.id}`}>
                                                <Button variant="ghost" size="sm" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div className="text-sm text-gray-600">
                Showing {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
}

export default TestList;

