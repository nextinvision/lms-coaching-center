// Student Notes Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ContentList } from '@/modules/content';
import { useAuth } from '@/modules/auth';
import { useStudent } from '@/modules/students';
import { Loader } from '@/shared/components/ui/Loader';

export default function StudentNotesPage() {
    const { user } = useAuth();
    const studentId = user?.studentProfile?.id || null;
    const { student } = useStudent(studentId);
    const batchId = student?.batchId || null;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Study Materials</h1>
                        <p className="text-gray-600 mt-2">Access your notes, PDFs, images, and videos</p>
                    </div>

                    {!batchId ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">You are not assigned to any batch yet.</p>
                        </div>
                    ) : (
                        <ContentList batchId={batchId} />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

