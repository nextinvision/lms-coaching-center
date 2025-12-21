// Academic Year Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Calendar, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { AcademicYear } from '../types/academic-year.types';

interface AcademicYearCardProps {
    academicYear: AcademicYear;
    showActions?: boolean;
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AcademicYearCard({ academicYear, showActions = true, onView, onEdit, onDelete }: AcademicYearCardProps) {
    const batchesCount = academicYear.batches?.length || 0;

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            {academicYear.year}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            {academicYear.isActive && (
                                <Badge variant="success">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Active
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(academicYear.startDate).toLocaleDateString()} - {new Date(academicYear.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{batchesCount} Batch{batchesCount !== 1 ? 'es' : ''}</span>
                </div>
            </CardContent>
            {showActions && (
                <CardFooter className="flex gap-2">
                    {onView && (
                        <Button variant="primary" size="sm" onClick={() => onView(academicYear.id)}>
                            View
                        </Button>
                    )}
                    {!onView && (
                        <Link href={`/admin/academic-years/${academicYear.id}`}>
                            <Button variant="primary" size="sm">
                                View
                            </Button>
                        </Link>
                    )}
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={() => onEdit(academicYear.id)}>
                            Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(academicYear.id)}>
                            Delete
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default AcademicYearCard;

