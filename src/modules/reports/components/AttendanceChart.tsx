'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import type { BatchAttendanceReport } from '../types/report.types';

interface AttendanceChartProps {
    data: BatchAttendanceReport[];
    chartType?: 'bar' | 'line' | 'pie';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AttendanceChart({ data, chartType = 'bar' }: AttendanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-gray-600">
                    No data available for visualization
                </CardContent>
            </Card>
        );
    }

    // Prepare data for batch-level visualization
    const batchData = data.map((batch) => ({
        name: batch.batchName,
        attendance: parseFloat(batch.averageAttendance.toFixed(2)),
        students: batch.totalStudents,
    }));

    // Prepare data for pie chart (overall present vs absent)
    const totalPresent = data.reduce(
        (sum, batch) =>
            sum +
            batch.students.reduce((s, student) => s + student.presentDays, 0),
        0
    );
    const totalAbsent = data.reduce(
        (sum, batch) =>
            sum +
            batch.students.reduce((s, student) => s + student.absentDays, 0),
        0
    );

    const pieData = [
        { name: 'Present', value: totalPresent },
        { name: 'Absent', value: totalAbsent },
    ];

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={batchData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="attendance"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Attendance %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
                                }
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === 0 ? '#10b981' : '#ef4444'}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
            default:
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={batchData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Visualization</CardTitle>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    );
}

export default AttendanceChart;
