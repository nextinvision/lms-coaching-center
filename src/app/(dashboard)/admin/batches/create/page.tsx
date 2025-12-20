// Admin Create Batch Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { BatchForm } from '@/modules/batches';
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Loader } from '@/shared/components/ui/Loader';

export default function AdminCreateBatchPage() {
    const [academicYears, setAcademicYears] = useState<Array<{ label: string; value: string }>>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const fetchAcademicYears = async () => {
        try {
            const response = await fetch('/api/academic-years');
            if (response.ok) {
                const result = await response.json();
                const options =
                    result.data?.map((year: any) => ({
                        label: year.year,
                        value: year.id,
                    })) || [];
                setAcademicYears(options);
            }
        } catch (error) {
            console.error('Failed to fetch academic years:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['manage_batches']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

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

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Batch</h1>
                        <p className="text-gray-600 mt-2">Create a new batch for students</p>
                    </div>

                    <BatchForm
                        academicYearOptions={academicYears}
                        onSuccess={() => {
                            window.location.href = '/admin/batches';
                        }}
                        onCancel={() => {
                            window.location.href = '/admin/batches';
                        }}
                    />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

