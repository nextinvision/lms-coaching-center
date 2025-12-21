// Admin Add Teacher Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TeacherForm } from '@/modules/teachers';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminAddTeacherPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push('/admin/teachers');
    };

    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add Teacher</h1>
                            <p className="text-gray-600 mt-2">Create a new teacher account</p>
                        </div>
                        <Link href="/admin/teachers">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Teachers
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-2xl">
                        <TeacherForm onSuccess={handleSuccess} />
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

