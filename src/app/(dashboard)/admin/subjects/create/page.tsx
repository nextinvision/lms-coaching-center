// Admin Create Subject Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { SubjectForm } from '@/modules/subjects';
import { useBatches } from '@/modules/batches';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Loader } from '@/shared/components/ui/Loader';

export default function AdminCreateSubjectPage() {
    const { batches, isLoading } = useBatches();

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['manage_subjects']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    const batchOptions =
        batches?.map((b) => ({ label: b.name, value: b.id })) || [];

    return (
        <ProtectedRoute requiredPermissions={['manage_subjects']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/subjects">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Subjects
                            </Button>
                        </Link>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Subject</h1>
                        <p className="text-gray-600 mt-2">Create a new subject for a batch</p>
                    </div>

                    <SubjectForm
                        batchOptions={batchOptions}
                        onSuccess={() => {
                            window.location.href = '/admin/subjects';
                        }}
                        onCancel={() => {
                            window.location.href = '/admin/subjects';
                        }}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

