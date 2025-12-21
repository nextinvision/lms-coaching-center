// Homework Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { FileText, Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Assignment } from '../types/homework.types';

interface HomeworkCardProps {
    assignment: Assignment;
    showActions?: boolean;
    onView?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function HomeworkCard({ assignment, showActions = true, onView, onDelete }: HomeworkCardProps) {
    const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
    const isDueSoon = assignment.dueDate && 
        new Date(assignment.dueDate) > new Date() && 
        new Date(assignment.dueDate).getTime() - Date.now() < 24 * 60 * 60 * 1000; // Within 24 hours

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            {assignment.title}
                        </CardTitle>
                        {assignment.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                {assignment.description}
                            </p>
                        )}
                    </div>
                    {isOverdue && (
                        <Badge variant="danger">Overdue</Badge>
                    )}
                    {isDueSoon && !isOverdue && (
                        <Badge variant="warning">Due Soon</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{assignment.batch.name}</span>
                    </div>
                    {assignment.subject && (
                        <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{assignment.subject.name}</span>
                        </div>
                    )}
                </div>
                {assignment.dueDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                )}
                {assignment.fileUrl && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                        <FileText className="h-4 w-4" />
                        <span>File attached</span>
                    </div>
                )}
            </CardContent>
            {showActions && (
                <CardFooter className="flex gap-2">
                    {onView && (
                        <Button variant="primary" size="sm" onClick={() => onView(assignment.id)}>
                            View
                        </Button>
                    )}
                    {!onView && (
                        <Link href={`/teacher/homework/${assignment.id}`}>
                            <Button variant="primary" size="sm">
                                View
                            </Button>
                        </Link>
                    )}
                    {onDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(assignment.id)}>
                            Delete
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default HomeworkCard;

