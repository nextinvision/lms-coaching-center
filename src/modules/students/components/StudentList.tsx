// Student List Component
'use client';

import React from 'react';
import { useStudents } from '../hooks/useStudents';
import { StudentCard } from './StudentCard';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { Loader } from '@/shared/components/ui/Loader';
import type { StudentFilters } from '../types/student.types';

interface StudentListProps {
    filters?: StudentFilters;
    onStudentClick?: (studentId: string) => void;
}

export function StudentList({ filters, onStudentClick }: StudentListProps) {
    const { students, isLoading, error } = useStudents(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading students..." />
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

    if (students.length === 0) {
        return (
            <EmptyState
                title="No students found"
                description="There are no students matching your criteria."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
                <StudentCard
                    key={student.id}
                    student={student}
                    onClick={() => onStudentClick?.(student.id)}
                />
            ))}
        </div>
    );
}

export default StudentList;

