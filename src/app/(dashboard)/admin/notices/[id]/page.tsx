// Admin Notice Details Page
'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useNotice, NoticeForm } from '@/modules/notices';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Loader } from '@/shared/components/ui/Loader';
import { Edit, ArrowLeft, Bell, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminNoticeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [noticeId, setNoticeId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const { notice, isLoading } = useNotice(noticeId);

    useEffect(() => {
        params.then((p) => setNoticeId(p.id));
    }, [params]);

    const handleSuccess = () => {
        setIsEditModalOpen(false);
        setRefreshKey((prev) => prev + 1);
    };

    if (!noticeId) {
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
                        <Loader text="Loading notice..." />
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
                        <Link href="/admin/notices">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Notices
                            </Button>
                        </Link>
                        <Button onClick={() => setIsEditModalOpen(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Notice
                        </Button>
                    </div>

                    {notice && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-blue-600" />
                                        {notice.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge>{notice.type}</Badge>
                                        {notice.isActive ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="danger">Inactive</Badge>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Content (English)</p>
                                    <p className="text-gray-900 whitespace-pre-wrap">{notice.content}</p>
                                </div>
                                {notice.contentAssamese && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Content (Assamese)</p>
                                        <p className="text-gray-900 whitespace-pre-wrap">{notice.contentAssamese}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    {notice.batch ? (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{notice.batch.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>All Batches</span>
                                        </div>
                                    )}
                                    {notice.expiresAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {notice && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onClose={() => setIsEditModalOpen(false)}
                            title="Edit Notice"
                        >
                            <NoticeForm
                                notice={notice}
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

