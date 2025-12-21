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
import useTranslation from '@/core/i18n/useTranslation';
import { Loader } from '@/shared/components/ui/Loader';

export default function TeacherContentPage() {
    const { batches, isLoading: batchesLoading, error: batchesError } = useBatches();
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const { t } = useTranslation();

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
                            <h1 className="text-3xl font-bold text-gray-900">{t('content.contentManagement')}</h1>
                            <p className="text-gray-600 mt-2">{t('content.manageContent')}</p>
                        </div>
                        <Link href="/teacher/content/upload">
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('content.uploadContent')}
                            </Button>
                        </Link>
                    </div>

                    {batchesLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader text={t('common.loading')} />
                        </div>
                    ) : batchesError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{t('common.error')}: {batchesError}</p>
                        </div>
                    ) : batches && batches.length > 0 ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('content.selectBatch')}
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
                                    <p className="text-gray-600">{t('content.selectBatchToView')}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">{t('messages.noData')}</p>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

