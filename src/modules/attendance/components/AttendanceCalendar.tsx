// Attendance Calendar Component
'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { useAttendance } from '../hooks/useAttendance';
import { Loader } from '@/shared/components/ui/Loader';
import type { AttendanceFilters } from '../types/attendance.types';

interface AttendanceCalendarProps {
    studentId: string;
    batchId?: string;
    month?: number;
    year?: number;
}

export function AttendanceCalendar({
    studentId,
    batchId,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
}: AttendanceCalendarProps) {
    // Memoize dates to prevent recreation
    const startDate = useMemo(() => new Date(year, month - 1, 1), [year, month]);
    const endDate = useMemo(() => new Date(year, month, 0), [year, month]);

    // Memoize filters to prevent object recreation on every render
    const filters: AttendanceFilters = useMemo(
        () => ({
            studentId,
            batchId,
            startDate,
            endDate,
        }),
        [studentId, batchId, startDate, endDate]
    );

    const { attendances, isLoading, error } = useAttendance(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading calendar..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    // Create a map of date -> attendance
    const attendanceMap = new Map<string, boolean>();
    attendances.forEach((att) => {
        const dateKey = new Date(att.date).toISOString().split('T')[0];
        attendanceMap.set(dateKey, att.present);
    });

    // Get days in month
    const daysInMonth = endDate.getDate();
    const firstDay = startDate.getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}
                    {days.map((day) => {
                        const date = new Date(year, month - 1, day);
                        const dateKey = date.toISOString().split('T')[0];
                        const isPresent = attendanceMap.get(dateKey);
                        const isToday = dateKey === new Date().toISOString().split('T')[0];

                        return (
                            <div
                                key={day}
                                className={`p-2 text-center rounded-lg border ${
                                    isToday ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                            >
                                <div className="text-sm font-medium">{day}</div>
                                {isPresent !== undefined && (
                                    <Badge
                                        variant={isPresent ? 'success' : 'danger'}
                                        className="text-xs mt-1"
                                    >
                                        {isPresent ? 'P' : 'A'}
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default AttendanceCalendar;

