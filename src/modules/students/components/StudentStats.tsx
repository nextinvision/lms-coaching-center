// Student Stats Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useStudentStats } from '../hooks/useStudentStats';
import { Loader } from '@/shared/components/ui/Loader';

export function StudentStats() {
    const { stats, isLoading, error } = useStudentStats();

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading statistics..." />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Failed to load statistics'}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-green-600">{stats.activeStudents}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Students by Batch</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {stats.studentsByBatch.map((item) => (
                            <div key={item.batchId} className="flex justify-between">
                                <span className="text-sm text-gray-600">{item.batchName}</span>
                                <span className="text-sm font-medium">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default StudentStats;

