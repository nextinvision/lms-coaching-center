// Teacher Students Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentTable } from '@/modules/students';
import { useBatches } from '@/modules/batches';
import { useState, useMemo } from 'react';
import { Input } from '@/shared/components/ui/Input';
import { useRouter } from 'next/navigation';

export default function TeacherStudentsPage() {
    const router = useRouter();
    const { batches, isLoading: batchesLoading } = useBatches();
    const [search, setSearch] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(
        batches?.[0]?.id || null
    );

    // Memoize filters to prevent object recreation
    const filters = useMemo(
        () => ({
            batchId: selectedBatchId || undefined,
            search: search || undefined,
        }),
        [selectedBatchId, search]
    );

    const handleView = (studentId: string) => {
        router.push(`/teacher/students/${studentId}`);
    };

    return (
        <ProtectedRoute requiredPermissions={['view_students']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                        <p className="text-gray-600 mt-2">View students in your assigned batches</p>
                    </div>

                    {batchesLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Loading batches...</p>
                        </div>
                    ) : !batches || batches.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No batches assigned to you</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Filter by Batch
                                    </label>
                                    <select
                                        value={selectedBatchId || ''}
                                        onChange={(e) => setSelectedBatchId(e.target.value || null)}
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Batches</option>
                                        {batches.map((batch) => (
                                            <option key={batch.id} value={batch.id}>
                                                {batch.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Students
                                    </label>
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <StudentTable filters={filters} onView={handleView} />
                        </>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

