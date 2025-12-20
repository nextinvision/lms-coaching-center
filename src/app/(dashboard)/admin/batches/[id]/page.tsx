// Admin Batch Details Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { BatchDetails, BatchAssignment } from '@/modules/batches';
import { useParams } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Loader } from '@/shared/components/ui/Loader';

export default function AdminBatchDetailsPage() {
    const params = useParams();
    const batchId = params.id as string;
    const [teacherOptions, setTeacherOptions] = useState<Array<{ label: string; value: string }>>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await fetch('/api/teachers');
            if (response.ok) {
                const result = await response.json();
                const options =
                    result.data?.map((teacher: any) => ({
                        label: teacher.user.name,
                        value: teacher.id,
                    })) || [];
                setTeacherOptions(options);
            }
        } catch (error) {
            console.error('Failed to fetch teachers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredPermissions={['manage_batches']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/batches">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Batches
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <Loader text="Loading..." />
                    ) : (
                        <>
                            <BatchDetails batchId={batchId} />
                            <BatchAssignment batchId={batchId} teacherOptions={teacherOptions} />
                        </>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

