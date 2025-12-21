// Teacher Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useToast } from '@/shared/components/ui/Toast';
import { createTeacherSchema, updateTeacherSchema } from '../services/teacherValidation';
import type { CreateTeacherInput, UpdateTeacherInput, Teacher } from '../types/teacher.types';

interface TeacherFormProps {
    teacher?: Teacher; // Optional teacher for edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function TeacherForm({ teacher, onSuccess, onCancel }: TeacherFormProps) {
    const isEdit = !!teacher;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(isEdit ? updateTeacherSchema : createTeacherSchema) as any,
        defaultValues: isEdit
            ? {
                  name: teacher.name,
                  email: teacher.user.email,
                  phone: teacher.user.phone || '',
              }
            : {
                  name: '',
                  email: '',
                  phone: '',
                  password: '',
              },
    });

    const onSubmit = async (data: CreateTeacherInput | UpdateTeacherInput) => {
        try {
            setIsSubmitting(true);
            const url = isEdit ? `/api/teachers/${teacher.id}` : '/api/teachers';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save teacher');
            }

            showToast({
                message: isEdit ? 'Teacher updated successfully' : 'Teacher created successfully',
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
                label="Name"
                {...register('name')}
                error={errors.name?.message as string | undefined}
                required
            />

            <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message as string | undefined}
                required
                disabled={isEdit}
            />

            <Input
                label="Phone (Optional)"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message as string | undefined}
            />

            {!isEdit && (
                <Input
                    label="Password"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message as string | undefined}
                    required
                />
            )}

            {isEdit && (
                <Input
                    label="New Password (Optional - leave empty to keep current)"
                    type="password"
                    {...register('password')}
                    error={errors.password?.message as string | undefined}
                />
            )}

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Teacher' : 'Create Teacher'}
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

export default TeacherForm;

