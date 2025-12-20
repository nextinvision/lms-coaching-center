// Admin Batches Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { BatchList, BatchForm } from '@/modules/batches';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import type { Batch } from '@/modules/batches';

export default function AdminBatchesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
    const [search, setSearch] = useState('');
    const [academicYears, setAcademicYears] = useState<Array<{ label: string; value: string }>>(
        []
    );

    useEffect(() => {
        fetchAcademicYears();
    }, []);

    const fetchAcademicYears = async () => {
        try {
            const response = await fetch('/api/academic-years');
            if (response.ok) {
                const result = await response.json();
                const options =
                    result.data?.map((year: any) => ({
                        label: year.year,
                        value: year.id,
                    })) || [];
                setAcademicYears(options);
            }
        } catch (error) {
            console.error('Failed to fetch academic years:', error);
        }
    };

    const handleEdit = (batch: Batch) => {
        setEditingBatch(batch);
        setIsModalOpen(true);
    };

    const handleDelete = async (batchId: string) => {
        if (!confirm('Are you sure you want to delete this batch?')) return;

        try {
            const response = await fetch(`/api/batches/${batchId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete batch');
            }

            window.location.reload();
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const handleView = (batchId: string) => {
        window.location.href = `/admin/batches/${batchId}`;
    };

    return (
        <ProtectedRoute requiredPermissions={['manage_batches']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
                            <p className="text-gray-600 mt-2">Manage all batches</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Batch
                        </Button>
                    </div>

                    <Input
                        placeholder="Search batches..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <BatchList
                        filters={{ search }}
                        onBatchClick={handleView}
                    />

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingBatch(null);
                        }}
                        title={editingBatch ? 'Edit Batch' : 'Create Batch'}
                    >
                        <BatchForm
                            initialData={editingBatch || undefined}
                            academicYearOptions={academicYears}
                            onSuccess={() => {
                                setIsModalOpen(false);
                                setEditingBatch(null);
                                window.location.reload();
                            }}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setEditingBatch(null);
                            }}
                        />
                    </Modal>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

