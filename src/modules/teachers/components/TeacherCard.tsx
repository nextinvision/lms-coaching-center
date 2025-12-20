// Teacher Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Avatar } from '@/shared/components/ui/Avatar';
import { GraduationCap, Users, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import type { Teacher } from '../types/teacher.types';

interface TeacherCardProps {
    teacher: Teacher;
    showActions?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function TeacherCard({ teacher, showActions = true, onView, onEdit, onDelete }: TeacherCardProps) {
    const assignedBatches = teacher.batchAssignments?.length || 0;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <Avatar
                        src={teacher.user.imageUrl || undefined}
                        alt={teacher.name}
                        size="lg"
                    />
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
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
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{teacher.user.email}</span>
                </div>
                {teacher.user.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{teacher.user.phone}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{assignedBatches} Batch{assignedBatches !== 1 ? 'es' : ''}</span>
                </div>
            </CardContent>
            {showActions && (
                <CardFooter className="flex gap-2">
                    {onView && (
                        <Button variant="default" size="sm" onClick={() => onView(teacher.id)}>
                            View
                        </Button>
                    )}
                    {!onView && (
                        <Link href={`/admin/teachers/${teacher.id}`}>
                            <Button variant="default" size="sm">
                                View
                            </Button>
                        </Link>
                    )}
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(teacher.id)}>
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(teacher.id)}>
                            Delete
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default TeacherCard;

