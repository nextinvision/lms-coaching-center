// Student Dashboard Component
'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useStudent } from '../hooks/useStudent';
import { useAuth } from '@/modules/auth';
import { useContentByBatch } from '@/modules/content';
import { Loader } from '@/shared/components/ui/Loader';
import { Progress } from '@/shared/components/ui/Progress';
import { BookOpen, FileText, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export function StudentDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    
    // Memoize studentId to prevent unnecessary re-renders
    const studentId = useMemo(() => {
        return user?.studentProfile?.id || null;
    }, [user?.studentProfile?.id]);
    
    const { student, isLoading: studentLoading } = useStudent(studentId);
    
    // Memoize batchId to prevent unnecessary re-renders
    const batchId = useMemo(() => {
        return student?.batchId || null;
    }, [student?.batchId]);
    
    const { content, isLoading: contentLoading } = useContentByBatch(batchId);
    
    // Show loading if auth is still loading or student is loading
    if (authLoading || studentLoading) {

        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading dashboard..." />
            </div>
        );
    }

    const recentContent = content?.slice(0, 5) || [];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Available Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{content?.length || 0}</p>
                        <p className="text-sm text-gray-600">Total content</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Tests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {student?.totalTests || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total tests</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-yellow-600" />
                            Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">
                            {student?.completedTests || 0}
                        </p>
                        <p className="text-sm text-gray-600">Tests completed</p>
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
                        <div className="space-y-2">
                            <p className="text-3xl font-bold text-purple-600">
                                {student?.attendancePercentage?.toFixed(1) || 0}%
                            </p>
                            {student?.attendancePercentage !== undefined && (
                                <Progress value={student.attendancePercentage} />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Content */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Recent Notes</CardTitle>
                        <Link href="/student/notes" className="text-sm text-blue-600 hover:underline">
                            View All
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {contentLoading ? (
                        <Loader text="Loading content..." />
                    ) : recentContent.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">No content available</p>
                    ) : (
                        <div className="space-y-3">
                            {recentContent.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/student/notes/${item.id}`}
                                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-gray-600">
                                                {item.chapterName || 'No chapter'}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default StudentDashboard;

