'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useAuth } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t('teacher.dashboard')}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {user?.name}!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">45</p>
                                <p className="text-sm text-gray-600">Total Students</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">28</p>
                                <p className="text-sm text-gray-600">Uploaded</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-yellow-600">8</p>
                                <p className="text-sm text-gray-600">Created</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Homework</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-purple-600">12</p>
                                <p className="text-sm text-gray-600">To Check</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

