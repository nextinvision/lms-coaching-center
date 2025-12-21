// Student Homework Submission Page
'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/modules/auth';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { useHomework } from '@/modules/homework';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { FileUpload } from '@/shared/components/ui/FileUpload';
import { Loader } from '@/shared/components/ui/Loader';
import { useToast } from '@/shared/components/ui/Toast';
import { ArrowLeft, FileText, Calendar, Users, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/modules/auth/store/authStore';

export default function StudentHomeworkSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
    const [assignmentId, setAssignmentId] = useState<string | null>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { assignment, isLoading } = useHomework(assignmentId);
    const { showToast } = useToast();
    const { user } = useAuthStore();

    useEffect(() => {
        params.then((p) => setAssignmentId(p.id));
    }, [params]);

    useEffect(() => {
        if (assignmentId && user?.studentProfile?.id) {
            const loadSubmission = async () => {
                try {
                    const studentId = user.studentProfile?.id;
                    if (!studentId) return;
                    
                    const response = await fetch(`/api/homework/student/${studentId}`);
                    if (response.ok) {
                        const result = await response.json();
                        const mySubmission = result.data.find((s: any) => s.assignment.id === assignmentId);
                        if (mySubmission) {
                            setSubmission(mySubmission);
                            setFileUrl(mySubmission.fileUrl);
                        }
                    }
                } catch (err) {
                    console.error('Failed to load submission:', err);
                }
            };
            loadSubmission();
        }
    }, [assignmentId, user?.studentProfile?.id]);

    const handleFileUpload = async (files: File[]) => {
        if (files.length === 0) return;
        
        const file = files[0];
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('file', file);

            const isPDF = file.type === 'application/pdf';
            const uploadUrl = isPDF ? '/api/content/upload/pdf' : '/api/content/upload/image';

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            setFileUrl(result.data.url);
            showToast({
                message: 'File uploaded successfully',
                variant: 'success',
            });
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!fileUrl) {
            showToast({
                message: 'Please upload a file first',
                variant: 'error',
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`/api/homework/${assignmentId}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit assignment');
            }

            showToast({
                message: 'Assignment submitted successfully',
                variant: 'success',
            });

            // Reload submission
            if (user?.studentProfile?.id) {
                const loadSubmission = async () => {
                    try {
                        const studentId = user.studentProfile?.id;
                        if (!studentId) return;
                        
                        const response = await fetch(`/api/homework/student/${studentId}`);
                        if (response.ok) {
                            const result = await response.json();
                            const mySubmission = result.data.find((s: any) => s.assignment.id === assignmentId);
                            if (mySubmission) {
                                setSubmission(mySubmission);
                            }
                        }
                    } catch (err) {
                        console.error('Failed to reload submission:', err);
                    }
                };
                loadSubmission();
            }
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!assignmentId) {
        return (
            <ProtectedRoute>
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
            <ProtectedRoute>
                <DashboardLayout>
                    <div className="flex justify-center py-12">
                        <Loader text="Loading assignment..." />
                    </div>
                </DashboardLayout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Link href="/student/homework">
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
                                    <CardTitle>Submit Assignment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {submission && submission.isChecked && submission.marks !== null && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p className="text-sm font-medium text-gray-700">Marks</p>
                                            <p className="text-2xl font-bold text-green-600">{submission.marks}</p>
                                            {submission.remarks && (
                                                <p className="text-sm text-gray-600 mt-2">{submission.remarks}</p>
                                            )}
                                        </div>
                                    )}

                                    {submission && submission.fileUrl && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Your Submission</p>
                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Submission
                                            </a>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Submission File
                                        </label>
                                        <FileUpload
                                            onFileSelect={handleFileUpload}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            maxSize={10}
                                        />
                                        {fileUrl && (
                                            <p className="text-sm text-green-600 mt-2">
                                                File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleSubmit}
                                        isLoading={isSubmitting}
                                        disabled={!fileUrl || isSubmitting}
                                    >
                                        <Upload className="h-4 w-4 mr-2" />
                                        {submission ? 'Update Submission' : 'Submit Assignment'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}

