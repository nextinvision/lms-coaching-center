// Submission Viewer Component
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Badge } from '@/shared/components/ui/Badge';
import { useToast } from '@/shared/components/ui/Toast';
import { Loader } from '@/shared/components/ui/Loader';
import { CheckCircle, XCircle, Download, FileText } from 'lucide-react';
import type { AssignmentSubmission } from '../types/homework.types';
import { useAuth } from '@/modules/auth';

interface SubmissionViewerProps {
    submission: AssignmentSubmission;
    onUpdate?: () => void;
}

export function SubmissionViewer({ submission, onUpdate }: SubmissionViewerProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isChecking, setIsChecking] = useState(false);
    const [isChecked, setIsChecked] = useState(submission.isChecked);
    const [marks, setMarks] = useState<number | null>(submission.marks || null);
    const [remarks, setRemarks] = useState(submission.remarks || '');

    const handleCheck = async () => {
        if (!user || user.role !== 'TEACHER') {
            showToast({
                message: 'Only teachers can check submissions',
                variant: 'error',
            });
            return;
        }

        try {
            setIsChecking(true);

            const response = await fetch(`/api/homework/submissions/${submission.id}/check`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isChecked,
                    marks: marks || null,
                    remarks: remarks || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update submission');
            }

            showToast({
                message: 'Submission updated successfully',
                variant: 'success',
            });

            onUpdate?.();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Submission Details</CardTitle>
                    <Badge variant={submission.isChecked ? 'success' : 'warning'}>
                        {submission.isChecked ? 'Checked' : 'Pending'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-700">Student</p>
                    <p className="text-gray-900">{submission.student.user.name}</p>
                    <p className="text-sm text-gray-600">{submission.student.user.email}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700">Submitted At</p>
                    <p className="text-gray-900">
                        {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                </div>

                {submission.fileUrl && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Submission File</p>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View Submission
                            </a>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => submission.fileUrl && window.open(submission.fileUrl, '_blank')}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                )}

                {user?.role === 'TEACHER' && (
                    <div className="border-t pt-4 space-y-4">
                        <Checkbox
                            label="Mark as Checked"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                        />

                        <Input
                            label="Marks (Optional)"
                            type="number"
                            min="0"
                            max="100"
                            value={marks || ''}
                            onChange={(e) => setMarks(e.target.value ? parseInt(e.target.value) : null)}
                        />

                        <Textarea
                            label="Remarks (Optional)"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={3}
                        />

                        <Button
                            onClick={handleCheck}
                            isLoading={isChecking}
                            disabled={isChecking}
                            variant="primary"
                        >
                            {isChecked ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            {isChecked ? 'Mark as Checked' : 'Mark as Pending'}
                        </Button>
                    </div>
                )}

                {submission.isChecked && submission.marks !== null && (
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Marks</p>
                        <p className="text-2xl font-bold text-green-600">{submission.marks}</p>
                    </div>
                )}

                {submission.remarks && (
                    <div>
                        <p className="text-sm font-medium text-gray-700">Teacher Remarks</p>
                        <p className="text-gray-900">{submission.remarks}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default SubmissionViewer;

