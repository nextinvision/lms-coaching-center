// Teacher List Component
'use client';

import React from 'react';
import { TeacherCard } from './TeacherCard';
import { Loader } from '@/shared/components/ui/Loader';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useTeachers } from '../hooks/useTeachers';
import type { TeacherFilters } from '../types/teacher.types';

interface TeacherListProps {
    filters?: TeacherFilters;
    showActions?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function TeacherList({ filters, showActions = true, onView, onEdit, onDelete }: TeacherListProps) {
    const { teachers, isLoading, error } = useTeachers(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading teachers..." />
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

    if (teachers.length === 0) {
        return (
            <EmptyState
                title="No Teachers"
                description="No teachers found for the selected filters."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
                <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    showActions={showActions}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default TeacherList;

