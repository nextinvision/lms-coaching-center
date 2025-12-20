// Batch Details Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { useBatch } from '../hooks/useBatch';
import { Loader } from '@/shared/components/ui/Loader';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/shared/components/ui/Table';

interface BatchDetailsProps {
    batchId: string;
}

export function BatchDetails({ batchId }: BatchDetailsProps) {
    const { batch, isLoading, error } = useBatch(batchId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading batch details..." />
            </div>
        );
    }

    if (error || !batch) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Batch not found'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{batch.name}</CardTitle>
                    <p className="text-gray-600 mt-1">Academic Year: {batch.academicYear.year}</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{batch.studentCount}</p>
                                <p className="text-sm text-gray-600">Students</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">{batch.subjectCount}</p>
                                <p className="text-sm text-gray-600">Subjects</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-2xl font-bold">{batch.teacherCount}</p>
                                <p className="text-sm text-gray-600">Teachers</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {batch.subjects && batch.subjects.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Subjects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {batch.subjects.map((subject) => (
                                <Badge key={subject.id} variant="info">
                                    {subject.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {batch.students && batch.students.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Students ({batch.students.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {batch.students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.user.email}</TableCell>
                                            <TableCell>{student.phone}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default BatchDetails;

