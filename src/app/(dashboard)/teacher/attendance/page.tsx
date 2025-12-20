// Teacher Attendance Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AttendanceSheet } from '@/modules/attendance';
import { useBatches } from '@/modules/batches';
import { useState } from 'react';
import { Loader } from '@/shared/components/ui/Loader';

export default function TeacherAttendancePage() {
    const { batches, isLoading } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string>(
        batches?.[0]?.id || ''
    );

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['mark_attendance']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (!batches || batches.length === 0) {
        return (
            <ProtectedRoute requiredPermissions={['mark_attendance']}>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-gray-600">No batches assigned to you</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['mark_attendance']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
                        <p className="text-gray-600 mt-2">Mark daily attendance for your batches</p>
                    </div>

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

                    {selectedBatchId && (
                        <AttendanceSheet
                            batchId={selectedBatchId}
                            onSuccess={() => {
                                // Refresh or show success message
                            }}
                        />
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

