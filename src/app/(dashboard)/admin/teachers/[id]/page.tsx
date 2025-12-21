// Admin Teacher Details Page
'use client';

// Admin Teacher Details Page
'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { TeacherProfile, TeacherForm, useTeacher } from '@/modules/teachers';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminTeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { teacher } = useTeacher(teacherId);

    useEffect(() => {
        params.then((p) => setTeacherId(p.id));
    }, [params]);

    const handleSuccess = () => {
        setIsEditModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    if (!teacherId) {
        return (
            <ProtectedRoute requiredPermissions={['system_settings']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <p>Loading...</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/teachers">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Teachers
                            </Button>
                        </Link>
                        <Button onClick={() => setIsEditModalOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Teacher
                        </Button>
                    </div>

                    <TeacherProfile key={refreshKey} teacherId={teacherId} />

                    {teacher && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            title="Edit Teacher"
                        >
                            <TeacherForm
                                teacher={teacher}
                                onSuccess={handleSuccess}
                                onCancel={() => setIsEditModalOpen(false)}
                            />
                        </Modal>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

