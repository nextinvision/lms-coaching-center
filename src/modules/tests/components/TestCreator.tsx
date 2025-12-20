// Test Creator Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { QuestionBuilder } from './QuestionBuilder';
import { useToast } from '@/shared/components/ui/Toast';
import { createTestSchema, createQuestionSchema } from '../services/testValidation';
import type { CreateTestInput, CreateQuestionInput } from '../types/test.types';
import { useAuth } from '@/modules/auth';

interface TestCreatorProps {
    batchId: string;
    subjectOptions?: Array<{ label: string; value: string }>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function TestCreator({
    batchId,
    subjectOptions = [],
    onSuccess,
    onCancel,
}: TestCreatorProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState<CreateQuestionInput[]>([]);
    const { showToast } = useToast();
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<any>({
        resolver: zodResolver(createTestSchema) as any,
        defaultValues: {
            batchId,
            type: 'PRACTICE',
            totalMarks: 0,
        },
    });

    const onSubmit = async (data: CreateTestInput) => {
        if (questions.length === 0) {
            showToast({
                message: 'Please add at least one question',
                variant: 'error',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            // Create test
            const testResponse = await fetch('/api/tests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    totalMarks: questions.reduce((sum, q) => sum + q.marks, 0),
                    startDate: data.startDate || null,
                    endDate: data.endDate || null,
                }),
            });

            if (!testResponse.ok) {
                const errorData = await testResponse.json();
                throw new Error(errorData.error || 'Failed to create test');
            }

            const testResult = await testResponse.json();
            const testId = testResult.data.id;

            // Add questions
            for (const question of questions) {
                const questionResponse = await fetch(`/api/tests/${testId}/questions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(question),
                });

                if (!questionResponse.ok) {
                    throw new Error('Failed to add question');
                }
            }

            showToast({
                message: 'Test created successfully',
                variant: 'success',
            });

            onSuccess?.();
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total marks
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    setValue('totalMarks', totalMarks);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Test Title"
                    {...register('title')}
                    error={errors.title?.message as string | undefined}
                    required
                />

                <Select
                    label="Test Type"
                    {...register('type')}
                    options={[
                        { label: 'Practice', value: 'PRACTICE' },
                        { label: 'Weekly', value: 'WEEKLY' },
                        { label: 'Monthly', value: 'MONTHLY' },
                    ]}
                    error={errors.type?.message as string | undefined}
                    required
                />
            </div>

            <Textarea
                label="Description"
                {...register('description')}
                error={errors.description?.message as string | undefined}
                rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Subject (Optional)"
                    {...register('subjectId')}
                    options={[
                        { label: 'No Subject', value: '' },
                        ...subjectOptions,
                    ]}
                    error={errors.subjectId?.message as string | undefined}
                />

                <Input
                    label="Duration (Minutes)"
                    type="number"
                    {...register('durationMinutes', { valueAsNumber: true })}
                    error={errors.durationMinutes?.message as string | undefined}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Start Date (Optional)"
                    type="datetime-local"
                    {...register('startDate')}
                    error={errors.startDate?.message as string | undefined}
                />

                <Input
                    label="End Date (Optional)"
                    type="datetime-local"
                    {...register('endDate')}
                    error={errors.endDate?.message as string | undefined}
                />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                    Total Marks: {totalMarks}
                </p>
            </div>

            <QuestionBuilder questions={questions} onQuestionsChange={setQuestions} />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    Create Test
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
}

export default TestCreator;

