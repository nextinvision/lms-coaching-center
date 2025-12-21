// Academic Year Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { useToast } from '@/shared/components/ui/Toast';
import { createAcademicYearSchema, updateAcademicYearSchema } from '../services/academic-yearValidation';
import type { CreateAcademicYearInput, UpdateAcademicYearInput, AcademicYear } from '../types/academic-year.types';

interface AcademicYearFormProps {
    academicYear?: AcademicYear; // Optional academic year for edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function AcademicYearForm({ academicYear, onSuccess, onCancel }: AcademicYearFormProps) {
    const isEdit = !!academicYear;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(isEdit ? updateAcademicYearSchema : createAcademicYearSchema) as any,
        defaultValues: isEdit
            ? {
                  year: academicYear.year,
                  startDate: new Date(academicYear.startDate).toISOString().split('T')[0],
                  endDate: new Date(academicYear.endDate).toISOString().split('T')[0],
                  isActive: academicYear.isActive,
              }
            : {
                  year: '',
                  startDate: '',
                  endDate: '',
                  isActive: false,
              },
    });

    const onSubmit = async (data: CreateAcademicYearInput | UpdateAcademicYearInput) => {
        try {
            setIsSubmitting(true);
            const url = isEdit ? `/api/academic-years/${academicYear.id}` : '/api/academic-years';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save academic year');
            }

            showToast({
                message: isEdit ? 'Academic year updated successfully' : 'Academic year created successfully',
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
                label="Year (Format: YYYY-YYYY)"
                placeholder="e.g., 2024-2025"
                {...register('year')}
                error={errors.year?.message as string | undefined}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Start Date"
                    type="date"
                    {...register('startDate')}
                    error={errors.startDate?.message as string | undefined}
                    required
                />

                <Input
                    label="End Date"
                    type="date"
                    {...register('endDate')}
                    error={errors.endDate?.message as string | undefined}
                    required
                />
            </div>

            <Checkbox
                label="Set as Active Academic Year"
                {...register('isActive')}
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Academic Year' : 'Create Academic Year'}
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

export default AcademicYearForm;

