// Teacher Notices Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { NoticeBoard } from '@/modules/notices';

export default function TeacherNoticesPage() {
    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
                        <p className="text-gray-600 mt-2">Important announcements and updates</p>
                    </div>

                    <NoticeBoard showFilters={true} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

