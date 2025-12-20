// Student Table Component
'use client';

import React from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/shared/components/ui/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useStudents } from '../hooks/useStudents';
import { Loader } from '@/shared/components/ui/Loader';
import type { Student, StudentFilters } from '../types/student.types';
import { Edit2, Trash2 } from 'lucide-react';

interface StudentTableProps {
    filters?: StudentFilters;
    onEdit?: (student: Student) => void;
    onDelete?: (studentId: string) => void;
    onView?: (studentId: string) => void;
}

export function StudentTable({ filters, onEdit, onDelete, onView }: StudentTableProps) {
    const { students, isLoading, error } = useStudents(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading students..." />
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

    if (students.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No students found</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <div className="font-medium">{student.name}</div>
                            </TableCell>
                            <TableCell>{student.user.email}</TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell>
                                {student.batch ? (
                                    <Badge variant="info">{student.batch.name}</Badge>
                                ) : (
                                    <Badge variant="default">Unassigned</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={student.user.isActive ? 'success' : 'warning'}>
                                    {student.user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    {onView && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(student.id)}
                                        >
                                            View
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(student)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(student.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default StudentTable;

