// Batch Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Batch } from '../types/batch.types';
import { Users, BookOpen, GraduationCap } from 'lucide-react';

interface BatchCardProps {
    batch: Batch;
    onClick?: () => void;
}

export function BatchCard({ batch, onClick }: BatchCardProps) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? '' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="text-lg">{batch.name}</CardTitle>
                <p className="text-sm text-gray-600">{batch.academicYear.year}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Students:</span>
                        <span className="text-sm font-medium">{batch.students?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Subjects:</span>
                        <span className="text-sm font-medium">{batch.subjects?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Teachers:</span>
                        <span className="text-sm font-medium">{batch.teachers?.length || 0}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default BatchCard;

