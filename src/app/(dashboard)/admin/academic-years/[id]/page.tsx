// Admin Academic Year Details Page
'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useAcademicYear, AcademicYearForm } from '@/modules/academic-years';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Loader } from '@/shared/components/ui/Loader';
import { Edit, ArrowLeft, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminAcademicYearDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [academicYearId, setAcademicYearId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { academicYear, isLoading } = useAcademicYear(academicYearId);

    useEffect(() => {
        params.then((p) => setAcademicYearId(p.id));
    }, [params]);

    const handleSuccess = () => {
        setIsEditModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    if (!academicYearId) {
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

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['system_settings']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading academic year..." />
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
                        <Link href="/admin/academic-years">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Academic Years
                            </Button>
                        </Link>
                        <Button onClick={() => setIsEditModalOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Academic Year
                        </Button>
                    </div>

                    {academicYear && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        {academicYear.year}
                                    </CardTitle>
                                    {academicYear.isActive && (
                                        <Badge variant="success">Active</Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(academicYear.startDate).toLocaleDateString()} - {new Date(academicYear.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>{academicYear.batches?.length || 0} Batch{(academicYear.batches?.length || 0) !== 1 ? 'es' : ''}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {academicYear && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            title="Edit Academic Year"
                        >
                            <AcademicYearForm
                                academicYear={academicYear}
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

