// Teacher Tests Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TestList } from '@/modules/tests';
import { Button } from '@/shared/components/ui/Button';
import { useBatches } from '@/modules/batches';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function TeacherTestsPage() {
    const { batches } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

    // Update selectedBatchId when batches load
    useEffect(() => {
        if (batches && batches.length > 0 && !selectedBatchId) {
            setSelectedBatchId(batches[0].id);
        }
    }, [batches, selectedBatchId]);

    return (
        <ProtectedRoute requiredPermissions={['create_tests']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Test Management</h1>
                            <p className="text-gray-600 mt-2">Create and manage tests</p>
                        </div>
                        <Link href="/teacher/tests/create">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Test
                            </Button>
                        </Link>
                    </div>

                    {batches && batches.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Batch
                            </label>
                            <select
                                value={selectedBatchId || ''}
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

                    {selectedBatchId ? (
                        <TestList filters={{ batchId: selectedBatchId }} showFilters={true} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No batches assigned</p>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

