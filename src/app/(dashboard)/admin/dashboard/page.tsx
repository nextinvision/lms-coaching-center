// Admin Dashboard Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { StudentStats } from '@/modules/students';
import { TeacherStats } from '@/modules/teachers/components/TeacherStats';
import { Loader } from '@/shared/components/ui/Loader';
import { Users, GraduationCap, BookOpen, FileText, Bell, Calendar, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/Button';
import { useState, useEffect } from 'react';
import { useReports } from '@/modules/reports';
import { useActiveAcademicYear } from '@/modules/academic-years';

export default function AdminDashboardPage() {
    const { fetchReportStats, isLoading: reportsLoading } = useReports();
    const { academicYear: activeAcademicYear, isLoading: academicYearLoading } = useActiveAcademicYear();
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        let hasLoaded = false; // Prevent multiple calls
        
        const loadStats = async () => {
            if (hasLoaded) return; // Already loading or loaded
            hasLoaded = true;
            
            try {
                const data = await fetchReportStats();
                if (isMounted) {
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to load stats:', err);
                hasLoaded = false; // Allow retry on error
            }
        };
        
        loadStats();
        
        return () => {
            isMounted = false;
        };
    }, []); // Only run once on mount - fetchReportStats is stable

    return (
        <ProtectedRoute requiredPermissions={['system_settings']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your coaching center</p>
                        {activeAcademicYear && (
                            <p className="text-sm text-blue-600 mt-1">
                                Active Academic Year: {activeAcademicYear.year}
                            </p>
                        )}
                    </div>

                    {/* System Statistics */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-gray-600">Total Batches</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-green-600">{stats.totalBatches}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-gray-600">Average Attendance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.averageAttendance.toFixed(1)}%</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium text-gray-600">Average Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-purple-600">{stats.averagePerformance.toFixed(1)}%</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <StudentStats />
                    <TeacherStats />

                    {/* Management Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link href="/admin/students">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Students
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage students</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/teachers">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-green-600" />
                                        Teachers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage teachers</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/admins">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                        Admin Users
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage admin accounts</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/batches">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-yellow-600" />
                                        Batches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage batches</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/subjects">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-purple-600" />
                                        Subjects
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage subjects</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/academic-years">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-indigo-600" />
                                        Academic Years
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage academic years</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/notices">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-red-600" />
                                        Notices
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">Manage notices</p>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/admin/reports">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-orange-600" />
                                        Reports
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">View reports</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
