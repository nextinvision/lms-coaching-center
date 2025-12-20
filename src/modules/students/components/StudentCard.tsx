// Student Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import type { Student } from '../types/student.types';

interface StudentCardProps {
    student: Student;
    onClick?: () => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? '' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Avatar name={student.name} size="md" />
                    <div className="flex-1">
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <p className="text-sm text-gray-600">{student.user.email}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="text-sm font-medium">{student.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Batch:</span>
                        {student.batch ? (
                            <Badge variant="info">{student.batch.name}</Badge>
                        ) : (
                            <Badge variant="default">Unassigned</Badge>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <Badge variant={student.user.isActive ? 'success' : 'warning'}>
                            {student.user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default StudentCard;

