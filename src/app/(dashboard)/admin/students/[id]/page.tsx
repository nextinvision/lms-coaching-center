// Admin Student Details Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentProfile } from '@/modules/students';
import { useParams } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentDetailsPage() {
    const params = useParams();
    const studentId = params.id as string;

    return (
        <ProtectedRoute requiredPermissions={['manage_students']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/students">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Students
                            </Button>
                        </Link>
                    </div>

                    <StudentProfile studentId={studentId} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

