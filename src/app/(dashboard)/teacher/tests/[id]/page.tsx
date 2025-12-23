// Teacher Test Detail Page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Loader } from '@/shared/components/ui/Loader';
import { Clock, FileText, Calendar, Users, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Test } from '@/modules/tests/types/test.types';

export default function TestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;
    const [test, setTest] = useState<Test | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTest();
    }, [testId]);

    const fetchTest = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/tests/${testId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch test');
            }
            const result = await response.json();
            setTest(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'PRACTICE':
                return 'info';
            case 'WEEKLY':
                return 'warning';
            case 'MONTHLY':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getStatusBadge = (test: Test) => {
        const isUpcoming = test.startDate && new Date(test.startDate) > new Date();
        const isActive = test.isActive && (!test.startDate || new Date(test.startDate) <= new Date());

        if (isUpcoming) return <Badge variant="info">Upcoming</Badge>;
        if (isActive) return <Badge variant="success">Active</Badge>;
        return <Badge variant="default">Inactive</Badge>;
    };

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['create_tests']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading test details..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (error || !test) {
        return (
            <ProtectedRoute requiredPermissions={['create_tests']}>
                <DashboardLayout>
                    <div className="text-center py-12">
                        <p className="text-red-600">{error || 'Test not found'}</p>
                        <Link href="/teacher/tests">
                            <Button variant="outline" className="mt-4">
                                Back to Tests
                            </Button>
                        </Link>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['create_tests']}>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/teacher/tests">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{test.title}</h1>
                                <p className="text-gray-600 mt-1">Test Details</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/teacher/tests/${test.id}/results`}>
                                <Button variant="outline">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Results
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Test Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Test Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Title</label>
                                        <p className="text-gray-900 mt-1">{test.title}</p>
                                    </div>

                                    {test.description && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Description</label>
                                            <p className="text-gray-900 mt-1">{test.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Type</label>
                                            <div className="mt-1">
                                                <Badge variant={getTypeColor(test.type)}>{test.type}</Badge>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Status</label>
                                            <div className="mt-1">{getStatusBadge(test)}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Total Marks</label>
                                            <p className="text-gray-900 mt-1 flex items-center gap-1">
                                                <FileText className="h-4 w-4" />
                                                {test.totalMarks}
                                            </p>
                                        </div>
                                        {test.durationMinutes && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-700">Duration</label>
                                                <p className="text-gray-900 mt-1 flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {test.durationMinutes} minutes
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {(test.startDate || test.endDate) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {test.startDate && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                                                    <p className="text-gray-900 mt-1 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(test.startDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                            {test.endDate && (
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                                    <p className="text-gray-900 mt-1 flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(test.endDate).toLocaleString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {test.batch && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Batch</label>
                                            <p className="text-gray-900 mt-1">{test.batch.name}</p>
                                        </div>
                                    )}

                                    {test.subject && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Subject</label>
                                            <p className="text-gray-900 mt-1">{test.subject.name}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Questions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Questions ({test.questions?.length || 0})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {test.questions && test.questions.length > 0 ? (
                                        <div className="space-y-4">
                                            {test.questions.map((question, index) => (
                                                <div
                                                    key={question.id}
                                                    className="p-4 border border-gray-200 rounded-lg"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">
                                                                Q{index + 1}. {question.questionText}
                                                            </p>
                                                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                                                <Badge variant="default">{question.type}</Badge>
                                                                <span>{question.marks} marks</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No questions added yet</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Questions</span>
                                        <span className="text-lg font-semibold">{test.questions?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Total Marks</span>
                                        <span className="text-lg font-semibold">{test.totalMarks}</span>
                                    </div>
                                    {test.durationMinutes && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Duration</span>
                                            <span className="text-lg font-semibold">{test.durationMinutes} min</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
