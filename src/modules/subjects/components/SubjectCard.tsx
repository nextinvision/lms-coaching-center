// Subject Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import type { Subject } from '../types/subject.types';

interface SubjectCardProps {
    subject: Subject;
    onClick?: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow ${onClick ? '' : ''}`}
            onClick={onClick}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge variant="info">{subject.batch.name}</Badge>
                </div>
            </CardHeader>
        </Card>
    );
}

export default SubjectCard;

