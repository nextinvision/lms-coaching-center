// Performance Report Component
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { Loader } from '@/shared/components/ui/Loader';
import { BarChart3, LineChart as LineChartIcon, Radar as RadarIcon } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { useBatches } from '@/modules/batches';
import { PerformanceChart } from './PerformanceChart';
import { ExportButton } from './ExportButton';
import type { PerformanceReportFilters, BatchPerformanceReport } from '../types/report.types';

export function PerformanceReport() {
    const { fetchPerformanceReport, isLoading, error } = useReports();
    const { batches } = useBatches();
    const [filters, setFilters] = useState<PerformanceReportFilters>({});
    const [reportData, setReportData] = useState<BatchPerformanceReport[]>([]);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'radar'>('bar');
    const [showChart, setShowChart] = useState(true);

    const handleGenerate = async () => {
        try {
            const data = await fetchPerformanceReport(filters);
            setReportData(data);
        } catch (err) {
            console.error('Failed to generate report:', err);
        }
    };

    const handleExport = async (format: 'CSV' | 'PDF' | 'EXCEL') => {
        try {
            const response = await fetch('/api/reports/export/performance', {
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
            const extension = format === 'EXCEL' ? 'xlsx' : format.toLowerCase();
            a.download = `performance-report.${extension}`;
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
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Performance Report</CardTitle>
                        <ExportButton onExport={handleExport} isLoading={isLoading} />
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
                </CardContent>
            </Card>

            {reportData.length > 0 && (
                <>
                    {/* Chart Visualization */}
                    {showChart && (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Visualization</CardTitle>
                                        <div className="flex gap-2">
                                            <Button
                                                variant={chartType === 'bar' ? 'primary' : 'outline'}
                                                size="sm"
                                                onClick={() => setChartType('bar')}
                                            >
                                                <BarChart3 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={chartType === 'line' ? 'primary' : 'outline'}
                                                size="sm"
                                                onClick={() => setChartType('line')}
                                            >
                                                <LineChartIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant={chartType === 'radar' ? 'primary' : 'outline'}
                                                size="sm"
                                                onClick={() => setChartType('radar')}
                                            >
                                                <RadarIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <PerformanceChart data={reportData} chartType={chartType} />
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Data Tables */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Detailed Data</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowChart(!showChart)}
                                >
                                    {showChart ? 'Hide Chart' : 'Show Chart'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {reportData.map((batch) => (
                                    <div key={batch.batchId} className="space-y-2">
                                        <h3 className="text-lg font-semibold">{batch.batchName}</h3>
                                        <p className="text-sm text-gray-600">
                                            Average Performance: {batch.averagePerformance.toFixed(2)}%
                                        </p>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Student Name</TableHead>
                                                    <TableHead>Total Tests</TableHead>
                                                    <TableHead>Average Marks</TableHead>
                                                    <TableHead>Highest</TableHead>
                                                    <TableHead>Lowest</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {batch.students.map((student) => (
                                                    <TableRow key={student.studentId}>
                                                        <TableCell>{student.studentName}</TableCell>
                                                        <TableCell>{student.totalTests}</TableCell>
                                                        <TableCell>{student.averageMarks.toFixed(2)}%</TableCell>
                                                        <TableCell>{student.highestMarks.toFixed(2)}%</TableCell>
                                                        <TableCell>{student.lowestMarks.toFixed(2)}%</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

export default PerformanceReport;


