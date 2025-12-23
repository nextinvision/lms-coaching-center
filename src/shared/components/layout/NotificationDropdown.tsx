// Notification Dropdown Component
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import { Loader } from '../ui/Loader';
import Link from 'next/link';
import type { Notice } from '@/modules/notices/types/notice.types';

interface NotificationDropdownProps {
    userRole: string;
    batchId?: string | null;
}

export function NotificationDropdown({ userRole, batchId }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch recent active notices
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        const fetchNotices = async () => {
            try {
                setIsLoading(true);
                const queryParams = new URLSearchParams();
                queryParams.append('isActive', 'true');

                // For students, filter by their batch
                if (userRole === 'STUDENT' && batchId) {
                    queryParams.append('batchId', batchId);
                }
                // For admin and teacher, show all notices
                // (batchId can be null for all batches)

                const result = await deduplicatedFetch<{ data: Notice[] }>(
                    `/api/notices?${queryParams.toString()}`,
                    {
                        ttl: 30000, // Cache for 30 seconds
                    }
                );

                if (isMounted) {
                    // Get recent notices (last 10, sorted by priority and date)
                    const recentNotices = result.data
                        .filter((notice) => {
                            // Filter out expired notices
                            if (notice.expiresAt) {
                                return new Date(notice.expiresAt) > new Date();
                            }
                            return true;
                        })
                        .sort((a, b) => {
                            // Sort by priority first, then by date
                            if (b.priority !== a.priority) {
                                return b.priority - a.priority;
                            }
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })
                        .slice(0, 10);

                    setNotices(recentNotices);
                    setUnreadCount(recentNotices.length);
                }
            } catch (error) {
                console.error('Failed to fetch notices:', error);
                if (isMounted) {
                    setNotices([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchNotices();

        return () => {
            isMounted = false;
        };
    }, [isOpen, userRole, batchId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getNoticeTypeColor = (type: string) => {
        switch (type) {
            case 'IMPORTANT':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'EXAM_DATE':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'HOLIDAY':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getNoticeTypeLabel = (type: string) => {
        switch (type) {
            case 'IMPORTANT':
                return 'Important';
            case 'EXAM_DATE':
                return 'Exam Date';
            case 'HOLIDAY':
                return 'Holiday';
            default:
                return 'General';
        }
    };

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return d.toLocaleDateString();
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 relative"
                title="Notifications"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded hover:bg-gray-100"
                            title="Close"
                        >
                            <X className="h-4 w-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader text="Loading notifications..." />
                            </div>
                        ) : notices.length === 0 ? (
                            <div className="p-8 text-center text-gray-600">
                                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notices.map((notice) => (
                                    <Link
                                        key={notice.id}
                                        href={
                                            userRole === 'ADMIN'
                                                ? `/admin/notices/${notice.id}`
                                                : userRole === 'TEACHER'
                                                    ? `/teacher/notices`
                                                    : `/student/notices`
                                        }
                                        onClick={() => setIsOpen(false)}
                                        className="block p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span
                                                        className={cn(
                                                            'px-2 py-0.5 text-xs font-medium rounded border',
                                                            getNoticeTypeColor(notice.type)
                                                        )}
                                                    >
                                                        {getNoticeTypeLabel(notice.type)}
                                                    </span>
                                                    {notice.priority > 0 && (
                                                        <span className="text-xs text-gray-600">
                                                            Priority: {notice.priority}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="font-medium text-gray-900 truncate">{notice.title}</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                                                    {notice.content}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                                    <span>{formatDate(notice.createdAt)}</span>
                                                    {notice.batch && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{notice.batch.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-gray-600 shrink-0 mt-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notices.length > 0 && (
                        <div className="border-t border-gray-200 p-3">
                            <Link
                                href={
                                    userRole === 'ADMIN'
                                        ? '/admin/notices'
                                        : userRole === 'TEACHER'
                                            ? '/teacher/notices'
                                            : '/student/notices'
                                }
                                onClick={() => setIsOpen(false)}
                                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View All Notices
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

