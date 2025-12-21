// Homework List Component
'use client';

import React from 'react';
import { HomeworkCard } from './HomeworkCard';
import { Loader } from '@/shared/components/ui/Loader';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useHomeworks } from '../hooks/useHomeworks';
import type { AssignmentFilters } from '../types/homework.types';

interface HomeworkListProps {
    filters?: AssignmentFilters;
    showActions?: boolean;
    onView?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function HomeworkList({ filters, showActions = true, onView, onDelete }: HomeworkListProps) {
    const { assignments, isLoading, error } = useHomeworks(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading assignments..." />
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

    if (assignments.length === 0) {
        return (
            <EmptyState
                title="No Assignments"
                description="No assignments found for the selected filters."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
                <HomeworkCard
                    key={assignment.id}
                    assignment={assignment}
                    showActions={showActions}
                    onView={onView}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default HomeworkList;

