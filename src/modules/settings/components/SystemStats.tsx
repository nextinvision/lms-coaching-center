// System Statistics Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Loader } from '@/shared/components/ui/Loader';
import { Users, GraduationCap, UserCog, Shield, BookOpen, FileText, ClipboardList, Bell, Calendar } from 'lucide-react';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { SystemStats as SystemStatsType } from '../types/settings.types';

export function SystemStatsComponent() {
    const [stats, setStats] = useState<SystemStatsType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const result = await deduplicatedFetch<{ data: SystemStatsType }>('/api/settings/stats', {
                    ttl: 60000, // Cache for 60 seconds
                });

                if (isMounted) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch system stats:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading statistics..." />
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Students',
            value: stats.totalStudents,
            icon: GraduationCap,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Teachers',
            value: stats.totalTeachers,
            icon: UserCog,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Admins',
            value: stats.totalAdmins,
            icon: Shield,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
        },
        {
            title: 'Batches',
            value: stats.totalBatches,
            icon: BookOpen,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Subjects',
            value: stats.totalSubjects,
            icon: FileText,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
        },
        {
            title: 'Content Items',
            value: stats.totalContent,
            icon: ClipboardList,
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
        },
        {
            title: 'Tests',
            value: stats.totalTests,
            icon: FileText,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Notices',
            value: stats.totalNotices,
            icon: Bell,
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        System Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.activeAcademicYear && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700">
                                <span className="font-semibold">Active Academic Year:</span> {stats.activeAcademicYear}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statCards.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${stat.bgColor} border-gray-200`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{stat.title}</p>
                                            <p className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
                                        </div>
                                        <Icon className={`h-8 w-8 ${stat.color}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

