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
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/teachers/stats');

                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const result = await response.json();
                setStats(result.data);
            } catch (error) {
                console.error('Failed to fetch teacher stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
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

