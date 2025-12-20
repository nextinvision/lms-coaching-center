// Test Results Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Progress } from '@/shared/components/ui/Progress';
import { Loader } from '@/shared/components/ui/Loader';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import type { TestSubmission, Answer } from '../types/test.types';

interface TestResultsProps {
    testId: string;
}

export function TestResults({ testId }: TestResultsProps) {
    const { user } = useAuth();
    const [submission, setSubmission] = useState<TestSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchResults();
    }, [testId]);

    const fetchResults = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const studentId = user?.studentProfile?.id;
            if (!studentId) {
                throw new Error('Student profile not found');
            }

            const response = await fetch(`/api/tests/${testId}/submission/${studentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }

            const result = await response.json();
            setSubmission(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading results..." />
            </div>
        );
    }

    if (error || !submission) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{error || 'Results not found'}</p>
            </div>
        );
    }

    const percentage = (submission.obtainedMarks / submission.totalMarks) * 100;

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Marks</p>
                            <p className="text-2xl font-bold">{submission.totalMarks}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Obtained Marks</p>
                            <p className="text-2xl font-bold text-green-600">
                                {submission.obtainedMarks}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Percentage</p>
                            <p className="text-2xl font-bold">{percentage.toFixed(1)}%</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Score</span>
                            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={percentage} />
                    </div>

                    {submission.timeSpent && (
                        <p className="text-sm text-gray-600">
                            Time Spent: {submission.timeSpent} minutes
                        </p>
                    )}

                    <p className="text-sm text-gray-600">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                </CardContent>
            </Card>

            {/* Answers Review */}
            {submission.answers && submission.answers.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Answer Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {submission.answers.map((answer: Answer, index: number) => {
                            const question = answer.question;
                            if (!question) return null;

                            return (
                                <div key={answer.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                Question {index + 1}: {question.questionText}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Marks: {answer.marksObtained} / {question.marks}
                                            </p>
                                        </div>
                                        {answer.isCorrect !== null && (
                                            <div>
                                                {answer.isCorrect ? (
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-5 w-5 text-red-600" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {question.type === 'MCQ' && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">
                                                Your Answer: {answer.selectedOption || 'Not answered'}
                                            </p>
                                        </div>
                                    )}

                                    {question.type === 'SHORT_ANSWER' && (
                                        <div className="mt-2">
                                            <p className="text-sm font-medium">Your Answer:</p>
                                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded mt-1">
                                                {answer.answerText || 'Not answered'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default TestResults;

