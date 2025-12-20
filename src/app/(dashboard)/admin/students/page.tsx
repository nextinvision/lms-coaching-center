// Admin Students Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { StudentTable, StudentForm } from '@/modules/students';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useBatches } from '@/modules/batches';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import type { Student } from '@/modules/students';

export default function AdminStudentsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [search, setSearch] = useState('');
    const { batches } = useBatches();

    const batchOptions =
        batches?.map((b) => ({ label: b.name, value: b.id })) || [];

    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = async (studentId: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const response = await fetch(`/api/students/${studentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            window.location.reload();
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const handleView = (studentId: string) => {
        window.location.href = `/admin/students/${studentId}`;
    };

    return (
        <ProtectedRoute requiredPermissions={['manage_students']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                            <p className="text-gray-600 mt-2">Manage all students</p>
                        </div>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Student
                        </Button>
                    </div>

                    <Input
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <StudentTable
                        filters={{ search }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={handleView}
                    />

                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingStudent(null);
                        }}
                        title={editingStudent ? 'Edit Student' : 'Add Student'}
                    >
                        <StudentForm
                            initialData={editingStudent || undefined}
                            batchOptions={batchOptions}
                            onSuccess={() => {
                                setIsModalOpen(false);
                                setEditingStudent(null);
                                window.location.reload();
                            }}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setEditingStudent(null);
                            }}
                        />
                    </Modal>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

