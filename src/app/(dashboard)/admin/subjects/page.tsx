// Admin Subjects Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { SubjectList, SubjectForm } from '@/modules/subjects';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useBatches } from '@/modules/batches';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import type { Subject } from '@/modules/subjects';

export default function AdminSubjectsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [search, setSearch] = useState('');
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');
    const { batches } = useBatches();

    const batchOptions =
        batches?.map((b) => ({ label: b.name, value: b.id })) || [];

    const handleEdit = (subject: Subject) => {
        setEditingSubject(subject);
        setIsModalOpen(true);
    };

    const handleDelete = async (subjectId: string) => {
        if (!confirm('Are you sure you want to delete this subject?')) return;

        try {
            const response = await fetch(`/api/subjects/${subjectId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete subject');
            }

            window.location.reload();
        } catch (error) {
            alert((error as Error).message);
        }
    };

    return (
        <ProtectedRoute requiredPermissions={['manage_subjects']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
                            <p className="text-gray-600 mt-2">Manage all subjects</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Subject
                        </Button>
                    </div>

                    {batches && batches.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Batch
                            </label>
                            <select
                                value={selectedBatchId}
                                onChange={(e) => setSelectedBatchId(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Batches</option>
                                {batches.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <Input
                        placeholder="Search subjects..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <SubjectList
                        filters={{ batchId: selectedBatchId || undefined, search }}
                    />

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingSubject(null);
                        }}
                        title={editingSubject ? 'Edit Subject' : 'Create Subject'}
                    >
                        <SubjectForm
                            initialData={editingSubject || undefined}
                            batchOptions={batchOptions}
                            onSuccess={() => {
                                setIsModalOpen(false);
                                setEditingSubject(null);
                                window.location.reload();
                            }}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setEditingSubject(null);
                            }}
                        />
                    </Modal>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

