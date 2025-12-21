// Teacher Content Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ContentList } from '@/modules/content';
import { Button } from '@/shared/components/ui/Button';
import { useBatches } from '@/modules/batches';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function TeacherContentPage() {
    const { batches, isLoading: batchesLoading } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

    // Derive initial batchId from batches when they load
    const initialBatchId = batches && batches.length > 0 ? batches[0].id : null;
    
    // Use the derived value if selectedBatchId is not set
    const effectiveBatchId = selectedBatchId || initialBatchId;

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                            <p className="text-gray-600 mt-2">Manage your uploaded content</p>
                        </div>
                        <Link href="/teacher/content/upload">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Upload Content
                            </Button>
                        </Link>
                    </div>

                    {batchesLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Loading batches...</p>
                        </div>
                    ) : batches && batches.length > 0 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Batch
                                </label>
                                <select
                                    value={effectiveBatchId || ''}
                                    onChange={(e) => setSelectedBatchId(e.target.value || null)}
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    {batches.map((batch) => (
                                        <option key={batch.id} value={batch.id}>
                                            {batch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {effectiveBatchId ? (
                                <ContentList batchId={effectiveBatchId} showFilters={true} />
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-600">Select a batch to view content</p>
                                </div>
                            )}
                        </>
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

