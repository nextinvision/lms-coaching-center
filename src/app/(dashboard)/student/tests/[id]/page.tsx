// Student Take Test Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TestTaker } from '@/modules/tests';
import { useParams, useRouter } from 'next/navigation';

export default function StudentTakeTestPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;

    const handleComplete = () => {
        router.push(`/student/tests/results/${testId}`);
    };

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Take Test</h1>
                    </div>
                    <TestTaker testId={testId} onComplete={handleComplete} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

