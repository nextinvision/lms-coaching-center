// Student Profile Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { useStudent } from '../hooks/useStudent';
import { Loader } from '@/shared/components/ui/Loader';
import { Progress } from '@/shared/components/ui/Progress';

interface StudentProfileProps {
    studentId: string;
}

export function StudentProfile({ studentId }: StudentProfileProps) {
    const { student, isLoading, error } = useStudent(studentId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading student profile..." />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Student not found'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar name={student.name} size="xl" />
                        <div>
                            <CardTitle className="text-2xl">{student.name}</CardTitle>
                            <p className="text-gray-600 mt-1">{student.user.email}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            <p className="text-gray-900">{student.phone}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Batch</label>
                            <p>
                                {student.batch ? (
                                    <Badge variant="info">{student.batch.name}</Badge>
                                ) : (
                                    <Badge variant="default">Unassigned</Badge>
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <p>
                                <Badge variant={student.user.isActive ? 'success' : 'warning'}>
                                    {student.user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Enrolled</label>
                            <p className="text-gray-900">
                                {new Date(student.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {student.attendancePercentage !== undefined && (
                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Attendance</span>
                                <span className="text-sm font-medium">
                                    {student.attendancePercentage}%
                                </span>
                            </div>
                            <Progress value={student.attendancePercentage} />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">
                                    {student.totalTests || 0}
                                </p>
                                <p className="text-sm text-gray-600">Total Tests</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">
                                    {student.completedTests || 0}
                                </p>
                                <p className="text-sm text-gray-600">Completed</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {student.pendingAssignments || 0}
                                </p>
                                <p className="text-sm text-gray-600">Pending Assignments</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default StudentProfile;

