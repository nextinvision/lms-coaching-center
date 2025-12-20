// Test Taker Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Radio, RadioGroup } from '@/shared/components/ui/Radio';
import { Textarea } from '@/shared/components/ui/Textarea';
import { useTest } from '../hooks/useTest';
import { useTestSubmission, useTestTimer } from '../hooks';
import { useToast } from '@/shared/components/ui/Toast';
import { Loader } from '@/shared/components/ui/Loader';
import { Alert } from '@/shared/components/ui/Alert';
import { Clock, CheckCircle } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/feedback/ConfirmDialog';
import type { Question, MCQOptions } from '../types/test.types';

interface TestTakerProps {
    testId: string;
    onComplete?: () => void;
}

export function TestTaker({ testId, onComplete }: TestTakerProps) {
    const { test, isLoading } = useTest(testId, true);
    const { submitTest, isSubmitting } = useTestSubmission();
    const { showToast } = useToast();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, { answerText?: string; selectedOption?: string }>>({});
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [startTime] = useState(Date.now());

    const timer = useTestTimer(test?.durationMinutes || null, () => {
        handleAutoSubmit();
    });

    useEffect(() => {
        if (test && !timer.isRunning) {
            timer.start();
        }
    }, [test]);

    const handleAnswerChange = (questionId: string, value: string, type: 'MCQ' | 'SHORT_ANSWER') => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [type === 'MCQ' ? 'selectedOption' : 'answerText']: value,
            },
        }));
    };

    const handleAutoSubmit = async () => {
        await handleSubmit(true);
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        if (!test) return;

        const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes

        try {
            const submissionData = {
                answers: test.questions.map((q) => ({
                    questionId: q.id,
                    answerText: answers[q.id]?.answerText || null,
                    selectedOption: answers[q.id]?.selectedOption || null,
                })),
                timeSpent,
            };

            await submitTest(testId, submissionData);

            showToast({
                message: isAutoSubmit ? 'Test auto-submitted due to time limit' : 'Test submitted successfully',
                variant: 'success',
            });

            onComplete?.();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading test..." />
            </div>
        );
    }

    if (!test) {
        return (
            <Alert variant="error" title="Error">
                Test not found
            </Alert>
        );
    }

    const currentQuestion = test.questions[currentQuestionIndex];
    const totalQuestions = test.questions.length;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="space-y-6">
            {/* Timer and Progress */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {test.durationMinutes && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-red-600" />
                                    <span className={`text-lg font-bold ${timer.isTimeUp ? 'text-red-600' : ''}`}>
                                        {timer.formattedTime}
                                    </span>
                                </div>
                            )}
                            <div className="text-sm text-gray-600">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Answered: {answeredCount} / {totalQuestions}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Question */}
            {currentQuestion && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Question {currentQuestion.order} ({currentQuestion.marks} marks)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-lg font-medium">{currentQuestion.questionText}</p>
                            {currentQuestion.questionTextAssamese && (
                                <p className="text-lg text-gray-600 mt-2">
                                    {currentQuestion.questionTextAssamese}
                                </p>
                            )}
                        </div>

                        {currentQuestion.type === 'MCQ' && currentQuestion.options && (
                            <RadioGroup
                                name={`question-${currentQuestion.id}`}
                                value={answers[currentQuestion.id]?.selectedOption || ''}
                                onChange={(value) =>
                                    handleAnswerChange(currentQuestion.id, value, 'MCQ')
                                }
                                options={(['A', 'B', 'C', 'D'] as const).map((option) => {
                                    const options = currentQuestion.options as unknown as MCQOptions;
                                    return {
                                        label: `${option}. ${options[option]}`,
                                        value: option,
                                    };
                                })}
                            />
                        )}

                        {currentQuestion.type === 'SHORT_ANSWER' && (
                            <Textarea
                                value={answers[currentQuestion.id]?.answerText || ''}
                                onChange={(e) =>
                                    handleAnswerChange(currentQuestion.id, e.target.value, 'SHORT_ANSWER')
                                }
                                rows={5}
                                placeholder="Type your answer here..."
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                <div className="flex gap-2">
                    {currentQuestionIndex < totalQuestions - 1 ? (
                        <Button
                            onClick={() =>
                                setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))
                            }
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowSubmitDialog(true)}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Submit Test
                        </Button>
                    )}
                </div>
            </div>

            <ConfirmDialog
                isOpen={showSubmitDialog}
                onClose={() => setShowSubmitDialog(false)}
                onConfirm={() => {
                    setShowSubmitDialog(false);
                    handleSubmit();
                }}
                title="Submit Test"
                message="Are you sure you want to submit the test? You cannot change your answers after submission."
            />
        </div>
    );
}

export default TestTaker;

