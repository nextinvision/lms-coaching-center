// Admin Admins Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AdminList, AdminForm } from '@/modules/admins';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { AdminWithDetails } from '@/modules/admins';

export default function AdminAdminsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminWithDetails | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEdit = (admin: AdminWithDetails) => {
        setEditingAdmin(admin);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (adminId: string) => {
        if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/admins/${adminId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete admin');
            }

            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            alert((error as Error).message);
        }
    };

    const handleSuccess = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setEditingAdmin(null);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
                            <p className="text-gray-600 mt-2">Manage admin accounts</p>
                        </div>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Admin
                        </Button>
                    </div>

                    <AdminList
                        key={refreshKey}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Modal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        title="Add Admin"
                    >
                        <AdminForm onSuccess={handleSuccess} onCancel={() => setIsCreateModalOpen(false)} />
                    </Modal>

                    <Modal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingAdmin(null);
                        }}
                        title="Edit Admin"
                    >
                        {editingAdmin && (
                            <AdminForm
                                admin={editingAdmin as any}
                                onSuccess={handleSuccess}
                                onCancel={() => {
                                    setIsEditModalOpen(false);
                                    setEditingAdmin(null);
                                }}
                            />
                        )}
                    </Modal>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

