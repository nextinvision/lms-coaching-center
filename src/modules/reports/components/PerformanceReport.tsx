// Performance Report Component
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Table } from '@/shared/components/ui/Table';
import { Loader } from '@/shared/components/ui/Loader';
import { Download } from 'lucide-react';
import { useReports } from '../hooks/useReports';
import { useBatches } from '@/modules/batches';
import type { PerformanceReportFilters, BatchPerformanceReport } from '../types/report.types';

export function PerformanceReport() {
    const { fetchPerformanceReport, isLoading, error } = useReports();
    const { batches } = useBatches();
    const [filters, setFilters] = useState<PerformanceReportFilters>({});
    const [reportData, setReportData] = useState<BatchPerformanceReport[]>([]);

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
            a.download = `performance-report.${format.toLowerCase()}`;
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
                    <CardTitle>Performance Report</CardTitle>
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
                                    Average Performance: {batch.averagePerformance.toFixed(2)}%
                                </p>
                                <Table
                                    columns={[
                                        { key: 'studentName', label: 'Student Name' },
                                        { key: 'totalTests', label: 'Total Tests' },
                                        { key: 'averageMarks', label: 'Average Marks' },
                                        { key: 'highestMarks', label: 'Highest' },
                                        { key: 'lowestMarks', label: 'Lowest' },
                                    ]}
                                    data={batch.students.map((s) => ({
                                        ...s,
                                        averageMarks: `${s.averageMarks.toFixed(2)}%`,
                                        highestMarks: `${s.highestMarks.toFixed(2)}%`,
                                        lowestMarks: `${s.lowestMarks.toFixed(2)}%`,
                                    }))}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default PerformanceReport;

