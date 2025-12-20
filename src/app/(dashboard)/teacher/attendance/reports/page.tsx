// Teacher Attendance Reports Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AttendanceReport } from '@/modules/attendance';
import { useBatches } from '@/modules/batches';
import { useState } from 'react';
import { Loader } from '@/shared/components/ui/Loader';

export default function TeacherAttendanceReportsPage() {
    const { batches, isLoading } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string>(
        batches?.[0]?.id || ''
    );

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['view_attendance']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['view_attendance']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Attendance Reports</h1>
                        <p className="text-gray-600 mt-2">View attendance statistics and reports</p>
                    </div>

                    {batches && batches.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Batch
                            </label>
                            <select
                                value={selectedBatchId}
                                onChange={(e) => setSelectedBatchId(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                {batches.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedBatchId && (
                        <AttendanceReport batchId={selectedBatchId} showFilters={true} />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

