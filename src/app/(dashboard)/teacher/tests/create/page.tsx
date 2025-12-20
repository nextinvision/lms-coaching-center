// Teacher Create Test Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TestCreator } from '@/modules/tests';
import { useBatches } from '@/modules/batches';
import { useSubjects } from '@/modules/subjects';
import { useState, useEffect } from 'react';
import { Loader } from '@/shared/components/ui/Loader';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TeacherCreateTestPage() {
    const { batches, isLoading: batchesLoading } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');
    const { subjects, isLoading: subjectsLoading } = useSubjects(
        selectedBatchId ? { batchId: selectedBatchId } : undefined
    );

    useEffect(() => {
        if (batches && batches.length > 0 && !selectedBatchId) {
            setSelectedBatchId(batches[0].id);
        }
    }, [batches]);

    if (batchesLoading) {
        return (
            <ProtectedRoute requiredPermissions={['create_tests']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (!batches || batches.length === 0) {
        return (
            <ProtectedRoute requiredPermissions={['create_tests']}>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-gray-600">No batches assigned to you</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    const subjectOptions =
        subjects?.map((s) => ({ label: s.name, value: s.id })) || [];

    return (
        <ProtectedRoute requiredPermissions={['create_tests']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/teacher/tests">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tests
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create Test</h1>
                        <p className="text-gray-600 mt-2">Create a new test with questions</p>
                    </div>

                    {selectedBatchId && (
                        <TestCreator
                            batchId={selectedBatchId}
                            subjectOptions={subjectOptions}
                            onSuccess={() => {
                                window.location.href = '/teacher/tests';
                            }}
                            onCancel={() => {
                                window.location.href = '/teacher/tests';
                            }}
                        />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

