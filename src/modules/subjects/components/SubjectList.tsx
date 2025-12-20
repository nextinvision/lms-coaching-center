// Subject List Component
'use client';

import React from 'react';
import { useSubjects } from '../hooks/useSubjects';
import { SubjectCard } from './SubjectCard';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import type { SubjectFilters } from '../types/subject.types';

interface SubjectListProps {
    filters?: SubjectFilters;
    onSubjectClick?: (subjectId: string) => void;
}

export function SubjectList({ filters, onSubjectClick }: SubjectListProps) {
    const { subjects, isLoading, error } = useSubjects(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading subjects..." />
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

    if (subjects.length === 0) {
        return (
            <EmptyState
                title="No subjects found"
                description="There are no subjects matching your criteria."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
                <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onClick={() => onSubjectClick?.(subject.id)}
                />
            ))}
        </div>
    );
}

export default SubjectList;

