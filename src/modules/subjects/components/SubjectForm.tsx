// Subject Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { createSubjectSchema, updateSubjectSchema } from '../services/subjectValidation';
import type { CreateSubjectInput, UpdateSubjectInput } from '../types/subject.types';
import { useToast } from '@/shared/components/ui/Toast';

interface SubjectFormProps {
    initialData?: UpdateSubjectInput & { id?: string };
    batchOptions?: Array<{ label: string; value: string }>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function SubjectForm({
    initialData,
    batchOptions = [],
    onSuccess,
    onCancel,
}: SubjectFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const isEdit = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateSubjectInput | UpdateSubjectInput>({
        resolver: zodResolver(isEdit ? updateSubjectSchema : createSubjectSchema),
        defaultValues: initialData || {},
    });

    const onSubmit = async (data: CreateSubjectInput | UpdateSubjectInput) => {
        try {
            setIsSubmitting(true);

            const url = isEdit ? `/api/subjects/${initialData.id}` : '/api/subjects';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save subject');
            }

            showToast({
                message: isEdit ? 'Subject updated successfully' : 'Subject created successfully',
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Subject Name"
                {...register('name')}
                error={errors.name?.message}
                required
            />

            {!isEdit && (
                <Select
                    label="Batch"
                    {...register('batchId')}
                    options={[
                        { label: 'Select Batch', value: '' },
                        ...batchOptions,
                    ]}
                    error={errors.batchId?.message}
                    required
                />
            )}

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Subject' : 'Create Subject'}
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

export default SubjectForm;

