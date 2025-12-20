// Student Profile Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentProfile } from '@/modules/students';
import { useAuth } from '@/modules/auth';

export default function StudentProfilePage() {
    const { user } = useAuth();
    const studentId = user?.studentProfile?.id || null;

    if (!studentId) {
        return (
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-gray-600">Student profile not found</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    </div>
                    <StudentProfile studentId={studentId} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

