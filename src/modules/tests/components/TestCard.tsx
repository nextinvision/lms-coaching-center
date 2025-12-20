// Test Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Test } from '../types/test.types';
import { Clock, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

interface TestCardProps {
    test: Test;
    onClick?: () => void;
    showActions?: boolean;
}

export function TestCard({ test, onClick, showActions = true }: TestCardProps) {
    const getTypeColor = () => {
        switch (test.type) {
            case 'PRACTICE':
                return 'info';
            case 'WEEKLY':
                return 'warning';
            case 'MONTHLY':
                return 'danger';
            default:
                return 'default';
        }
    };

    const isUpcoming = test.startDate && new Date(test.startDate) > new Date();
    const isActive = test.isActive && (!test.startDate || new Date(test.startDate) <= new Date());

    return (
        <Card
            className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        {test.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {test.description}
                            </p>
                        )}
                    </div>
                    <Badge variant={getTypeColor()}>{test.type}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {test.durationMinutes && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{test.durationMinutes} min</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{test.totalMarks} marks</span>
                        </div>
                        {test.questions && (
                            <span>{test.questions.length} questions</span>
                        )}
                    </div>

                    {test.startDate && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(test.startDate).toLocaleDateString()}
                                {test.endDate &&
                                    ` - ${new Date(test.endDate).toLocaleDateString()}`}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <Badge variant={isActive ? 'success' : 'default'}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {isUpcoming && <Badge variant="info">Upcoming</Badge>}
                    </div>

                    {showActions && (
                        <div className="pt-2 border-t">
                            <Link
                                href={`/student/tests/${test.id}`}
                                className="text-blue-600 hover:underline text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isActive ? 'Take Test' : 'View Details'}
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default TestCard;

