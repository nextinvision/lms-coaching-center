// Teacher Stats Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Loader } from '@/shared/components/ui/Loader';
import { GraduationCap, Users } from 'lucide-react';

export function TeacherStats() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let hasLoaded = false;

        const fetchStats = async () => {
            if (hasLoaded) return;
            hasLoaded = true;

            try {
                setIsLoading(true);
                
                // Use deduplicated fetch to prevent multiple calls
                const { deduplicatedFetch } = await import('@/core/utils/requestDeduplication');
                const result = await deduplicatedFetch<{ data: any }>('/api/teachers/stats', {
                    ttl: 60000, // Cache stats for 60 seconds
                });

                if (isMounted) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch teacher stats:', error);
                hasLoaded = false; // Allow retry on error
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
                <Loader text="Loading stats..." />
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Total Teachers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalTeachers}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        Active Teachers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">{stats.activeTeachers}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default TeacherStats;

