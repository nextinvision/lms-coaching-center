// Teacher Test Results Page
'use client';

import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/shared/components/ui/Table';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader } from '@/shared/components/ui/Loader';
import { Badge } from '@/shared/components/ui/Badge';
import type { TestSubmission } from '@/modules/tests';

export default function TeacherTestResultsPage() {
    const params = useParams();
    const testId = params.id as string;
    const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchResults();
    }, [testId]);

    const fetchResults = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/tests/${testId}/results`);
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }

            const result = await response.json();
            setSubmissions(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['grade_tests']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading results..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (error) {
        return (
            <ProtectedRoute requiredPermissions={['grade_tests']}>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['grade_tests']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
                        <p className="text-gray-600 mt-2">View all student submissions</p>
                    </div>

                    {submissions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No submissions yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Obtained Marks</TableHead>
                                        <TableHead>Total Marks</TableHead>
                                        <TableHead>Percentage</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map((submission) => {
                                        const percentage =
                                            (submission.obtainedMarks / submission.totalMarks) * 100;
                                        return (
                                            <TableRow key={submission.id}>
                                                <TableCell>
                                                    {submission.student.name}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {submission.obtainedMarks}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{submission.totalMarks}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            percentage >= 60
                                                                ? 'success'
                                                                : percentage >= 40
                                                                ? 'warning'
                                                                : 'danger'
                                                        }
                                                    >
                                                        {percentage.toFixed(1)}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(submission.submittedAt).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <a
                                                        href={`/teacher/tests/${testId}/submissions/${submission.id}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        View Details
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

