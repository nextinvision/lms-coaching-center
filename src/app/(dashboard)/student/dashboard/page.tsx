'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useAuth } from '@/modules/auth';
import useTranslation from '@/core/i18n/useTranslation';

export default function StudentDashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {t('student.dashboard')}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Welcome back, {user?.name}!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">12</p>
                                <p className="text-sm text-gray-600">Available</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">5</p>
                                <p className="text-sm text-gray-600">Upcoming</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Homework</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-yellow-600">3</p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-purple-600">85%</p>
                                <p className="text-sm text-gray-600">This Month</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

