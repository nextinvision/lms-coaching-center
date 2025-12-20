// Attendance Chart Component
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { useAttendanceStats } from '../hooks/useAttendanceStats';
import { Progress } from '@/shared/components/ui/Progress';
import { Loader } from '@/shared/components/ui/Loader';

interface AttendanceChartProps {
    studentId: string;
    batchId?: string;
}

export function AttendanceChart({ studentId, batchId }: AttendanceChartProps) {
    const { stats, isLoading, error } = useAttendanceStats(studentId, batchId);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading attendance..." />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Failed to load attendance'}</p>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Attendance Percentage</span>
                        <span className="text-sm font-medium">
                            {stats.attendancePercentage.toFixed(1)}%
                        </span>
                    </div>
                    <Progress value={stats.attendancePercentage} />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalDays}</p>
                        <p className="text-sm text-gray-600">Total Days</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{stats.presentDays}</p>
                        <p className="text-sm text-gray-600">Present</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
                        <p className="text-sm text-gray-600">Absent</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default AttendanceChart;

