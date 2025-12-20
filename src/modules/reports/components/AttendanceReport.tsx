// Attendance Report Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { Loader } from '@/shared/components/ui/Loader';
import { Download, FileText } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { useBatches } from '@/modules/batches';
import type { AttendanceReportFilters, BatchAttendanceReport } from '../types/report.types';

export function AttendanceReport() {
    const { fetchAttendanceReport, isLoading, error } = useReports();
    const { batches } = useBatches();
    const [filters, setFilters] = useState<AttendanceReportFilters>({});
    const [reportData, setReportData] = useState<BatchAttendanceReport[]>([]);

    const handleGenerate = async () => {
        try {
            const data = await fetchAttendanceReport(filters);
            setReportData(data);
        } catch (err) {
            console.error('Failed to generate report:', err);
        }
    };

    const handleExport = async (format: 'CSV' | 'PDF' | 'EXCEL') => {
        try {
            const response = await fetch('/api/reports/export/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filters, format }),
            });

            if (!response.ok) {
                throw new Error('Failed to export report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendance-report.${format.toLowerCase()}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Failed to export report:', err);
        }
    };

    const batchOptions = [
        { label: 'All Batches', value: '' },
        ...batches.map((batch) => ({
            label: batch.name,
            value: batch.id,
        })),
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Attendance Report</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport('CSV')}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select
                        label="Batch"
                        value={filters.batchId || ''}
                        onChange={(e) => setFilters({ ...filters, batchId: e.target.value || undefined })}
                        options={batchOptions}
                    />
                    <Input
                        label="Start Date"
                        type="date"
                        value={filters.startDate || ''}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                    />
                    <Input
                        label="End Date"
                        type="date"
                        value={filters.endDate || ''}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                    />
                    <div className="flex items-end">
                        <Button onClick={handleGenerate} isLoading={isLoading}>
                            Generate Report
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader text="Generating report..." />
                    </div>
                )}

                {reportData.length > 0 && (
                    <div className="space-y-6">
                        {reportData.map((batch) => (
                            <div key={batch.batchId} className="space-y-2">
                                <h3 className="text-lg font-semibold">{batch.batchName}</h3>
                                <p className="text-sm text-gray-600">
                                    Average Attendance: {batch.averageAttendance.toFixed(2)}%
                                </p>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Total Days</TableHead>
                                            <TableHead>Present</TableHead>
                                            <TableHead>Absent</TableHead>
                                            <TableHead>Percentage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {batch.students.map((student) => (
                                            <TableRow key={student.studentId}>
                                                <TableCell>{student.studentName}</TableCell>
                                                <TableCell>{student.totalDays}</TableCell>
                                                <TableCell>{student.presentDays}</TableCell>
                                                <TableCell>{student.absentDays}</TableCell>
                                                <TableCell>{student.attendancePercentage.toFixed(2)}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default AttendanceReport;

