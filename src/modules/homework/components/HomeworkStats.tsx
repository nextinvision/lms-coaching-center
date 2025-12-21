// Homework Stats Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Loader } from '@/shared/components/ui/Loader';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { useState, useEffect } from 'react';

interface HomeworkStatsProps {
    teacherId?: string;
}

export function HomeworkStats({ teacherId }: HomeworkStatsProps) {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const url = teacherId ? `/api/homework/stats?teacherId=${teacherId}` : '/api/homework/stats';
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }

                const result = await response.json();
                setStats(result.data);
            } catch (error) {
                console.error('Failed to fetch homework stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [teacherId]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Total Assignments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalAssignments}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        Pending Checks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingSubmissions}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Checked
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">{stats.checkedSubmissions}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default HomeworkStats;

