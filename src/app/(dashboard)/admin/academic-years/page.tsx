// Admin Academic Years Management Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { AcademicYearList, AcademicYearForm } from '@/modules/academic-years';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function AdminAcademicYearsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSuccess = () => {
        setIsCreateModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Academic Years</h1>
                            <p className="text-gray-600 mt-2">Manage academic years</p>
                        </div>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Academic Year
                        </Button>
                    </div>

                    <AcademicYearList key={refreshKey} />

                    <Modal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        title="Add Academic Year"
                    >
                        <AcademicYearForm onSuccess={handleSuccess} onCancel={() => setIsCreateModalOpen(false)} />
                    </Modal>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

