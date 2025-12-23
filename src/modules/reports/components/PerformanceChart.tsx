'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import type { BatchPerformanceReport } from '../types/report.types';

interface PerformanceChartProps {
    data: BatchPerformanceReport[];
    chartType?: 'bar' | 'line' | 'radar';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PerformanceChart({ data, chartType = 'bar' }: PerformanceChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-gray-500">
                    No data available for visualization
                </CardContent>
            </Card>
        );
    }

    // Prepare data for batch-level visualization
    const batchData = data.map((batch) => ({
        name: batch.batchName,
        performance: parseFloat(batch.averagePerformance.toFixed(2)),
        students: batch.totalStudents,
    }));

    // Prepare data for top performers (top 5 students across all batches)
    const allStudents = data.flatMap((batch) =>
        batch.students.map((student) => ({
            name: student.studentName,
            average: student.averageMarks,
            highest: student.highestMarks,
            lowest: student.lowestMarks,
        }))
    );
    const topPerformers = allStudents
        .sort((a, b) => b.average - a.average)
        .slice(0, 5);

    // Prepare subject-wise data (if available)
    const subjectData =
        data[0]?.students[0]?.subjectPerformance?.map((subject) => ({
            subject: subject.subjectName,
            average: subject.averageMarks,
        })) || [];

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
                                dataKey="performance"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                name="Performance %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'radar':
                if (subjectData.length > 0) {
                    return (
                        <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={subjectData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                                <Radar
                                    name="Average Performance"
                                    dataKey="average"
                                    stroke="#3b82f6"
                                    fill="#3b82f6"
                                    fillOpacity={0.6}
                                />
                                <Tooltip />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    );
                }
                // Fallback to bar chart if no subject data
                return renderBarChart();

            case 'bar':
            default:
                return renderBarChart();
        }
    };

    const renderBarChart = () => (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topPerformers.length > 0 ? topPerformers : batchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {topPerformers.length > 0 ? (
                    <>
                        <Bar dataKey="average" fill="#3b82f6" name="Average %" />
                        <Bar dataKey="highest" fill="#10b981" name="Highest %" />
                        <Bar dataKey="lowest" fill="#f59e0b" name="Lowest %" />
                    </>
                ) : (
                    <Bar dataKey="performance" fill="#3b82f6" name="Performance %" />
                )}
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {chartType === 'radar' && subjectData.length > 0
                        ? 'Subject-wise Performance'
                        : topPerformers.length > 0
                            ? 'Top 5 Performers'
                            : 'Batch Performance'}
                </CardTitle>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
        </Card>
    );
}

export default PerformanceChart;
