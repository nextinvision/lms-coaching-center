// Reports Dashboard Component
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Tabs } from '@/shared/components/ui/Tabs';
import { AttendanceReport } from './AttendanceReport';
import { PerformanceReport } from './PerformanceReport';
import { useReports } from '../hooks/useReports';
import { FileText, BarChart3 } from 'lucide-react';

export function ReportsDashboard() {
    const { fetchReportStats, isLoading } = useReports();
    const [activeTab, setActiveTab] = useState('attendance');
    const [stats, setStats] = useState<any>(null);

    React.useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchReportStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to load stats:', err);
            }
        };
        loadStats();
    }, [fetchReportStats]);

    const tabs = [
        {
            id: 'attendance',
            label: 'Attendance Report',
            icon: FileText,
            content: <AttendanceReport />,
        },
        {
            id: 'performance',
            label: 'Performance Report',
            icon: BarChart3,
            content: <PerformanceReport />,
        },
    ];

    return (
        <div className="space-y-6">
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats.totalStudents}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Total Batches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats.totalBatches}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Average Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats.averageAttendance.toFixed(2)}%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-gray-600">Average Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{stats.averagePerformance.toFixed(2)}%</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </div>
    );
}

export default ReportsDashboard;

