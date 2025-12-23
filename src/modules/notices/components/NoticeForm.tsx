// Notice Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { useToast } from '@/shared/components/ui/Toast';
import { createNoticeSchema, updateNoticeSchema } from '../services/noticeValidation';
import type { CreateNoticeInput, UpdateNoticeInput, Notice } from '../types/notice.types';
import { useBatches } from '@/modules/batches';
import { dateUtils } from '@/shared/utils/date';

interface NoticeFormProps {
    notice?: Notice; // Optional notice for edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function NoticeForm({ notice, onSuccess, onCancel }: NoticeFormProps) {
    const isEdit = !!notice;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const { batches } = useBatches();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(isEdit ? updateNoticeSchema : createNoticeSchema) as any,
        defaultValues: isEdit
            ? {
                  title: notice.title,
                  content: notice.content,
                  contentAssamese: notice.contentAssamese || '',
                  type: notice.type,
                  batchId: notice.batchId || '',
                  priority: notice.priority || 0,
                  expiresAt: notice.expiresAt
                      ? dateUtils.formatForDateTimeLocal(notice.expiresAt)
                      : '',
                  isActive: notice.isActive,
              }
            : {
                  title: '',
                  content: '',
                  contentAssamese: '',
                  type: 'GENERAL',
                  batchId: '',
                  priority: 0,
                  expiresAt: '',
                  isActive: true,
              },
    });

    const onSubmit = async (data: CreateNoticeInput | UpdateNoticeInput) => {
        try {
            setIsSubmitting(true);
            const url = isEdit ? `/api/notices/${notice.id}` : '/api/notices';
            const method = isEdit ? 'PATCH' : 'POST';

            // Convert datetime-local format to ISO datetime string
            const payload = {
                ...data,
                batchId: data.batchId || null,
                expiresAt: data.expiresAt 
                    ? dateUtils.convertToISODatetime(data.expiresAt) 
                    : null,
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save notice');
            }

            showToast({
                message: isEdit ? 'Notice updated successfully' : 'Notice created successfully',
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

    const batchOptions = [
        { label: 'All Batches', value: '' },
        ...batches.map((batch) => ({
            label: batch.name,
            value: batch.id,
        })),
    ];

    const typeOptions = [
        { label: 'General', value: 'GENERAL' },
        { label: 'Exam Date', value: 'EXAM_DATE' },
        { label: 'Holiday', value: 'HOLIDAY' },
        { label: 'Important', value: 'IMPORTANT' },
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Title"
                {...register('title')}
                error={errors.title?.message as string | undefined}
                required
            />

            <Textarea
                label="Content (English)"
                {...register('content')}
                error={errors.content?.message as string | undefined}
                rows={5}
                required
            />

            <Textarea
                label="Content (Assamese) - Optional"
                {...register('contentAssamese')}
                error={errors.contentAssamese?.message as string | undefined}
                rows={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Type"
                    {...register('type')}
                    options={typeOptions}
                    error={errors.type?.message as string | undefined}
                    required
                />

                <Select
                    label="Batch (Optional - leave empty for all batches)"
                    {...register('batchId')}
                    options={batchOptions}
                    error={errors.batchId?.message as string | undefined}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Priority (0-10)"
                    type="number"
                    min="0"
                    max="10"
                    {...register('priority', { valueAsNumber: true })}
                    error={errors.priority?.message as string | undefined}
                />

                <Input
                    label="Expires At (Optional)"
                    type="datetime-local"
                    {...register('expiresAt')}
                    error={errors.expiresAt?.message as string | undefined}
                />
            </div>

            {isEdit && (
                <Checkbox
                    label="Active"
                    {...register('isActive')}
                />
            )}

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Notice' : 'Create Notice'}
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

export default NoticeForm;

