// Teacher Content Upload Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ContentUpload } from '@/modules/content';
import { useBatches } from '@/modules/batches';
import { useSubjects } from '@/modules/subjects';
import { useState, useEffect } from 'react';
import { Loader } from '@/shared/components/ui/Loader';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TeacherContentUploadPage() {
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
            <ProtectedRoute requiredPermissions={['upload_content']}>
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
            <ProtectedRoute requiredPermissions={['upload_content']}>
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
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/teacher/content">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Content
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
                        <p className="text-gray-600 mt-2">Upload PDFs, images, or add YouTube videos</p>
                    </div>

                    {selectedBatchId && (
                        <ContentUpload
                            batchId={selectedBatchId}
                            subjectOptions={subjectOptions}
                            onSuccess={() => {
                                // Small delay to ensure cache is invalidated
                                setTimeout(() => {
                                    window.location.href = '/teacher/content';
                                }, 100);
                            }}
                            onCancel={() => {
                                window.location.href = '/teacher/content';
                            }}
                        />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

