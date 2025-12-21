// Student Homework Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { HomeworkList } from '@/modules/homework';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useStudent } from '@/modules/students';
import { useHomeworkByBatch } from '@/modules/homework';
import { useMemo } from 'react';
import { ClipboardList } from 'lucide-react';

export default function StudentHomeworkPage() {
    const { user } = useAuthStore();
    const studentId = useMemo(() => user?.studentProfile?.id || null, [user?.studentProfile?.id]);
    const { student } = useStudent(studentId);
    const batchId = useMemo(() => student?.batchId || null, [student?.batchId]);
    const { assignments } = useHomeworkByBatch(batchId);

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <ClipboardList className="h-8 w-8 text-blue-600" />
                            Homework
                        </h1>
                        <p className="text-gray-600 mt-2">View and submit your assignments</p>
                    </div>

                    <HomeworkList filters={{ batchId: batchId || undefined }} showActions={false} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

