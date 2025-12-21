// Teacher Student Details Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentProfile } from '@/modules/students';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function TeacherStudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    return (
        <ProtectedRoute requiredPermissions={['view_students']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/teacher/students')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Students
                        </Button>
                    </div>

                    <StudentProfile studentId={studentId} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

