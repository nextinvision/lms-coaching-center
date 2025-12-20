// Batch Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { createBatchSchema, updateBatchSchema } from '../services/batchValidation';
import type { CreateBatchInput, UpdateBatchInput } from '../types/batch.types';
import { useToast } from '@/shared/components/ui/Toast';

interface BatchFormProps {
    initialData?: UpdateBatchInput & { id?: string };
    academicYearOptions?: Array<{ label: string; value: string }>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function BatchForm({
    initialData,
    academicYearOptions = [],
    onSuccess,
    onCancel,
}: BatchFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const isEdit = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateBatchInput | UpdateBatchInput>({
        resolver: zodResolver(isEdit ? updateBatchSchema : createBatchSchema),
        defaultValues: initialData || {},
    });

    const onSubmit = async (data: CreateBatchInput | UpdateBatchInput) => {
        try {
            setIsSubmitting(true);

            const url = isEdit ? `/api/batches/${initialData.id}` : '/api/batches';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save batch');
            }

            showToast({
                message: isEdit ? 'Batch updated successfully' : 'Batch created successfully',
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
                label="Batch Name"
                {...register('name')}
                error={errors.name?.message}
                required
            />

            <Select
                label="Academic Year"
                {...register('academicYearId')}
                options={[
                    { label: 'Select Academic Year', value: '' },
                    ...academicYearOptions,
                ]}
                error={errors.academicYearId?.message}
                required
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Batch' : 'Create Batch'}
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

export default BatchForm;

