// Academic Year List Component
'use client';

import React from 'react';
import { AcademicYearCard } from './AcademicYearCard';
import { Loader } from '@/shared/components/ui/Loader';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { useAcademicYears } from '../hooks/useAcademicYears';
import type { AcademicYearFilters } from '../types/academic-year.types';

interface AcademicYearListProps {
    filters?: AcademicYearFilters;
    showActions?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AcademicYearList({ filters, showActions = true, onView, onEdit, onDelete }: AcademicYearListProps) {
    const { academicYears, isLoading, error } = useAcademicYears(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading academic years..." />
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

    if (academicYears.length === 0) {
        return (
            <EmptyState
                title="No Academic Years"
                description="No academic years found for the selected filters."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicYears.map((academicYear) => (
                <AcademicYearCard
                    key={academicYear.id}
                    academicYear={academicYear}
                    showActions={showActions}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default AcademicYearList;

