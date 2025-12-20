// Attendance Report Component
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { Badge } from '@/shared/components/ui/Badge';
import { useAttendance } from '../hooks/useAttendance';
import { Loader } from '@/shared/components/ui/Loader';
import { Input } from '@/shared/components/ui/Input';
import type { AttendanceFilters } from '../types/attendance.types';

interface AttendanceReportProps {
    batchId?: string;
    studentId?: string;
    showFilters?: boolean;
}

export function AttendanceReport({ batchId, studentId, showFilters = true }: AttendanceReportProps) {
    const [startDate, setStartDate] = useState(
        new Date(new Date().setDate(1)).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // Memoize filters to prevent infinite loops - Date objects are compared by reference
    const filters: AttendanceFilters = useMemo(
        () => ({
            batchId,
            studentId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        }),
        [batchId, studentId, startDate, endDate]
    );

    const { attendances, isLoading, error } = useAttendance(filters);

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading attendance report..." />
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

    return (
        <div className="space-y-4">
            {showFilters && (
                <Card>
                    <CardContent className="py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Attendance Report</CardTitle>
                </CardHeader>
                <CardContent>
                    {attendances.length === 0 ? (
                        <p className="text-center py-8 text-gray-600">No attendance records found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Remarks</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendances.map((attendance) => (
                                        <TableRow key={attendance.id}>
                                            <TableCell>
                                                {new Date(attendance.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {attendance.student.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={attendance.present ? 'success' : 'danger'}>
                                                    {attendance.present ? 'Present' : 'Absent'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {attendance.remarks || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AttendanceReport;

