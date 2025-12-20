// Student Tests Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TestList } from '@/modules/tests';
import { useAuth } from '@/modules/auth';
import { useStudent } from '@/modules/students';

export default function StudentTestsPage() {
    const { user } = useAuth();
    const studentId = user?.studentProfile?.id || null;
    const { student } = useStudent(studentId);
    const batchId = student?.batchId || null;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tests & Exams</h1>
                        <p className="text-gray-600 mt-2">View and take your tests</p>
                    </div>

                    {!batchId ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">You are not assigned to any batch yet.</p>
                        </div>
                    ) : (
                        <TestList filters={{ batchId, isActive: true }} />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

