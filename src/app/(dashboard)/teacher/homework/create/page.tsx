// Teacher Create Homework Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { HomeworkForm } from '@/modules/homework';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherCreateHomeworkPage() {
    const router = useRouter();

    const handleSuccess = () => {
        router.push('/teacher/homework');
    };

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Create Assignment</h1>
                            <p className="text-gray-600 mt-2">Create a new homework assignment</p>
                        </div>
                        <Link href="/teacher/homework">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Homework
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-2xl">
                        <HomeworkForm onSuccess={handleSuccess} />
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

