// Student Test Results Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TestResults } from '@/modules/tests';
import { useParams } from 'next/navigation';

export default function StudentTestResultsPage() {
    const params = useParams();
    const testId = params.id as string;

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
                    </div>
                    <TestResults testId={testId} />
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

