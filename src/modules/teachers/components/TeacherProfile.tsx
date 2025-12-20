// Teacher Profile Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Loader } from '@/shared/components/ui/Loader';
import { GraduationCap, Users, FileText, BookOpen, Mail, Phone } from 'lucide-react';
import { useTeacher } from '../hooks/useTeacher';

interface TeacherProfileProps {
    teacherId: string;
}

export function TeacherProfile({ teacherId }: TeacherProfileProps) {
    const { teacher, isLoading, error } = useTeacher(teacherId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading teacher profile..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Teacher not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <Avatar
                            src={teacher.user.imageUrl || undefined}
                            alt={teacher.name}
                            size="xl"
                        />
                        <div className="flex-1">
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-6 w-6 text-blue-600" />
                                {teacher.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                                {teacher.user.isActive ? (
                                    <Badge variant="success">Active</Badge>
                                ) : (
                                    <Badge variant="danger">Inactive</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-900">{teacher.user.email}</span>
                        </div>
                        {teacher.user.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-gray-600" />
                                <span className="text-gray-900">{teacher.user.phone}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Assigned Batches
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">
                            {teacher.assignedBatches.length}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Content Uploaded
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{teacher.totalContent}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-yellow-600" />
                            Tests Created
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">{teacher.totalTests}</p>
                    </CardContent>
                </Card>
            </div>

            {teacher.assignedBatches.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Batches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {teacher.assignedBatches.map((batch) => (
                                <div key={batch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">{batch.name}</span>
                                    <Badge>{batch.academicYear.year}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default TeacherProfile;

