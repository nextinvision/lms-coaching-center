// Admin Reports Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ReportsDashboard } from '@/modules/reports';

export default function AdminReportsPage() {
    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-600 mt-2">View and export reports</p>
                    </div>

                    <ReportsDashboard />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

