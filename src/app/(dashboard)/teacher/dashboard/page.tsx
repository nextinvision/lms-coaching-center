// Teacher Dashboard Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useAuth } from '@/modules/auth';
import { useBatches } from '@/modules/batches';
import { Loader } from '@/shared/components/ui/Loader';
import { Button } from '@/shared/components/ui/Button';
import { BookOpen, FileText, Users, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
    const { user } = useAuth();
    const { batches, isLoading: batchesLoading } = useBatches();
    const teacherBatches = batches || [];

    if (batchesLoading) {
        return (
            <ProtectedRoute requiredPermissions={['upload_content']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading dashboard..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    Batches
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-blue-600">
                                    {teacherBatches.length}
                                </p>
                                <p className="text-sm text-gray-600">Assigned batches</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-green-600">0</p>
                                <p className="text-sm text-gray-600">Uploaded items</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-yellow-600" />
                                    Tests
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-yellow-600">0</p>
                                <p className="text-sm text-gray-600">Created tests</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                    Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-purple-600">Today</p>
                                <p className="text-sm text-gray-600">Mark attendance</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href="/teacher/content/upload">
                                    <Button variant="outline" className="w-full justify-start">
                                        Upload Content
                                    </Button>
                                </Link>
                                <Link href="/teacher/tests/create">
                                    <Button variant="outline" className="w-full justify-start">
                                        Create Test
                                    </Button>
                                </Link>
                                <Link href="/teacher/attendance">
                                    <Button variant="outline" className="w-full justify-start">
                                        Mark Attendance
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
