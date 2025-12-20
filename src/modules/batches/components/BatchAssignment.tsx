// Batch Assignment Component (for assigning teachers)
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useToast } from '@/shared/components/ui/Toast';
import { Loader } from '@/shared/components/ui/Loader';
import { Badge } from '@/shared/components/ui/Badge';
import { X } from 'lucide-react';

interface BatchAssignmentProps {
    batchId: string;
    teacherOptions?: Array<{ label: string; value: string }>;
}

export function BatchAssignment({ batchId, teacherOptions = [] }: BatchAssignmentProps) {
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [assignedTeachers, setAssignedTeachers] = useState<Array<{ id: string; name: string }>>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchAssignedTeachers();
    }, [batchId]);

    const fetchAssignedTeachers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/batches/${batchId}`);
            if (response.ok) {
                const result = await response.json();
                const teachers =
                    result.data.teachers?.map((t: any) => ({
                        id: t.teacher.id,
                        name: t.teacher.user.name,
                    })) || [];
                setAssignedTeachers(teachers);
            }
        } catch (error) {
            showToast({
                message: 'Failed to load assigned teachers',
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedTeacher) return;

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/batches/${batchId}/teachers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherId: selectedTeacher }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign teacher');
            }

            showToast({
                message: 'Teacher assigned successfully',
                variant: 'success',
            });

            setSelectedTeacher('');
            fetchAssignedTeachers();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async (teacherId: string) => {
        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/batches/${batchId}/teachers/${teacherId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to remove teacher');
            }

            showToast({
                message: 'Teacher removed successfully',
                variant: 'success',
            });

            fetchAssignedTeachers();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading..." />
            </div>
        );
    }

    const availableTeachers = teacherOptions.filter(
        (t) => !assignedTeachers.some((at) => at.id === t.value)
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assign Teachers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        options={[
                            { label: 'Select Teacher', value: '' },
                            ...availableTeachers,
                        ]}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedTeacher || isSubmitting}
                        isLoading={isSubmitting}
                    >
                        Assign
                    </Button>
                </div>

                {assignedTeachers.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Assigned Teachers:</p>
                        <div className="flex flex-wrap gap-2">
                            {assignedTeachers.map((teacher) => (
                                <Badge key={teacher.id} variant="info" className="flex items-center gap-1">
                                    {teacher.name}
                                    <button
                                        onClick={() => handleRemove(teacher.id)}
                                        className="ml-1 hover:text-red-600"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default BatchAssignment;

