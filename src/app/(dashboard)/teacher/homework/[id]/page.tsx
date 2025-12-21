// Teacher Homework Details Page
'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useHomework } from '@/modules/homework';
import { SubmissionViewer } from '@/modules/homework';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Loader } from '@/shared/components/ui/Loader';
import { ArrowLeft, FileText, Calendar, Users, Download } from 'lucide-react';
import Link from 'next/link';
import { Table } from '@/shared/components/ui/Table';

export default function TeacherHomeworkDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const [assignmentId, setAssignmentId] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
    const { assignment, isLoading } = useHomework(assignmentId);

    useEffect(() => {
        params.then((p) => setAssignmentId(p.id));
    }, [params]);

    useEffect(() => {
        if (assignmentId) {
            const loadSubmissions = async () => {
                try {
                    setIsLoadingSubmissions(true);
                    const response = await fetch(`/api/homework/${assignmentId}/submissions`);
                    if (response.ok) {
                        const result = await response.json();
                        setSubmissions(result.data || []);
                    }
                } catch (err) {
                    console.error('Failed to load submissions:', err);
                } finally {
                    setIsLoadingSubmissions(false);
                }
            };
            loadSubmissions();
        }
    }, [assignmentId]);

    if (!assignmentId) {
        return (
            <ProtectedRoute requiredPermissions={['upload_content']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <p>Loading...</p>
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    if (isLoading) {
        return (
            <ProtectedRoute requiredPermissions={['upload_content']}>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading assignment..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredPermissions={['upload_content']}>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Link href="/teacher/homework">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Homework
                            </Button>
                        </Link>
                    </div>

                    {assignment && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        {assignment.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {assignment.description && (
                                        <p className="text-gray-700">{assignment.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>{assignment.batch.name}</span>
                                        </div>
                                        {assignment.subject && (
                                            <div className="flex items-center gap-1">
                                                <FileText className="h-4 w-4" />
                                                <span>{assignment.subject.name}</span>
                                            </div>
                                        )}
                                        {assignment.dueDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {assignment.fileUrl && (
                                        <div>
                                            <Button
                                                variant="outline"
                                                onClick={() => window.open(assignment.fileUrl!, '_blank')}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download Assignment File
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Submissions ({submissions.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingSubmissions ? (
                                        <Loader text="Loading submissions..." />
                                    ) : submissions.length === 0 ? (
                                        <p className="text-gray-600">No submissions yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {submissions.map((submission) => (
                                                <SubmissionViewer
                                                    key={submission.id}
                                                    submission={submission}
                                                    onUpdate={() => {
                                                        // Reload submissions
                                                        const loadSubmissions = async () => {
                                                            try {
                                                                const response = await fetch(`/api/homework/${assignmentId}/submissions`);
                                                                if (response.ok) {
                                                                    const result = await response.json();
                                                                    setSubmissions(result.data || []);
                                                                }
                                                            } catch (err) {
                                                                console.error('Failed to reload submissions:', err);
                                                            }
                                                        };
                                                        loadSubmissions();
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

