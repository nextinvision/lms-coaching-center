// Notice Card Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Bell, Calendar, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import type { Notice, NoticeType } from '../types/notice.types';

interface NoticeCardProps {
    notice: Notice;
    showActions?: boolean;
    onView?: (id: string) => void;
    onDelete?: (id: string) => void;
}

const noticeTypeColors: Record<NoticeType, string> = {
    GENERAL: 'bg-gray-500',
    EXAM_DATE: 'bg-blue-500',
    HOLIDAY: 'bg-green-500',
    IMPORTANT: 'bg-red-500',
};

const noticeTypeLabels: Record<NoticeType, string> = {
    GENERAL: 'General',
    EXAM_DATE: 'Exam Date',
    HOLIDAY: 'Holiday',
    IMPORTANT: 'Important',
};

export function NoticeCard({ notice, showActions = true, onView, onDelete }: NoticeCardProps) {
    const isExpired = notice.expiresAt && new Date(notice.expiresAt) < new Date();
    const isExpiringSoon = notice.expiresAt && 
        new Date(notice.expiresAt) > new Date() && 
        new Date(notice.expiresAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // Within 7 days

    return (
        <Card className={`hover:shadow-lg transition-shadow ${!notice.isActive ? 'opacity-60' : ''}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            {notice.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className={noticeTypeColors[notice.type as NoticeType]}>
                                {noticeTypeLabels[notice.type as NoticeType]}
                            </Badge>
                            {notice.priority > 5 && (
                                <Badge variant="warning">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    High Priority
                                </Badge>
                            )}
                            {isExpired && (
                                <Badge variant="danger">Expired</Badge>
                            )}
                            {isExpiringSoon && !isExpired && (
                                <Badge variant="warning">Expiring Soon</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                    {notice.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    {notice.batch ? (
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{notice.batch.name}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>All Batches</span>
                        </div>
                    )}
                    {notice.expiresAt && (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Expires: {new Date(notice.expiresAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
            {showActions && (
                <CardFooter className="flex gap-2">
                    {onView && (
                        <Button variant="primary" size="sm" onClick={() => onView(notice.id)}>
                            View
                        </Button>
                    )}
                    {!onView && (
                        <Link href={`/admin/notices/${notice.id}`}>
                            <Button variant="primary" size="sm">
                                View
                            </Button>
                        </Link>
                    )}
                    {onDelete && (
                        <Button variant="danger" size="sm" onClick={() => onDelete(notice.id)}>
                            Delete
                        </Button>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default NoticeCard;

