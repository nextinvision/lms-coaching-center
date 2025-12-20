// Student Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { createStudentSchema, updateStudentSchema } from '../services/studentValidation';
import type { CreateStudentInput, UpdateStudentInput } from '../types/student.types';
import { useToast } from '@/shared/components/ui/Toast';
import { Loader } from '@/shared/components/ui/Loader';

interface StudentFormProps {
    initialData?: UpdateStudentInput & { id?: string };
    batchOptions?: Array<{ label: string; value: string }>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function StudentForm({ initialData, batchOptions = [], onSuccess, onCancel }: StudentFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const isEdit = !!initialData?.id;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateStudentInput | UpdateStudentInput>({
        resolver: zodResolver(isEdit ? updateStudentSchema : createStudentSchema),
        defaultValues: initialData || {},
    });

    const onSubmit = async (data: CreateStudentInput | UpdateStudentInput) => {
        try {
            setIsSubmitting(true);

            const url = isEdit ? `/api/students/${initialData.id}` : '/api/students';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save student');
            }

            showToast({
                message: isEdit ? 'Student updated successfully' : 'Student created successfully',
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
            {!isEdit && (
                <>
                    <Input
                        label="Name"
                        {...register('name')}
                        error={errors.name?.message}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        {...register('email' as any)}
                        error={(errors as any).email?.message}
                        required
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        {...register('password' as any)}
                        error={(errors as any).password?.message}
                        required
                    />
                </>
            )}

            {isEdit && (
                <>
                    <Input
                        label="Name"
                        {...register('name')}
                        error={errors.name?.message}
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        {...register('phone')}
                        error={errors.phone?.message}
                    />
                </>
            )}

            <Select
                label="Batch"
                {...register('batchId')}
                options={[
                    { label: 'Select Batch', value: '' },
                    ...batchOptions,
                ]}
                error={errors.batchId?.message}
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Student' : 'Create Student'}
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

export default StudentForm;

