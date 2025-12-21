// Student Notices Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { NoticeBoard } from '@/modules/notices';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useStudent } from '@/modules/students';
import { useMemo } from 'react';

export default function StudentNoticesPage() {
    const { user } = useAuthStore();
    const studentId = useMemo(() => user?.studentProfile?.id || null, [user?.studentProfile?.id]);
    const { student } = useStudent(studentId);
    const batchId = useMemo(() => student?.batchId || null, [student?.batchId]);

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
                        <p className="text-gray-600 mt-2">Important announcements and updates</p>
                    </div>

                    <NoticeBoard batchId={batchId} showFilters={false} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

