// Student Dashboard Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentDashboard } from '@/modules/students';

export default function StudentDashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <StudentDashboard />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
