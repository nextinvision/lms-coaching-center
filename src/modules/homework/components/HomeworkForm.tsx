// Homework Form Component
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { FileUpload } from '@/shared/components/ui/FileUpload';
import { useToast } from '@/shared/components/ui/Toast';
import { createAssignmentSchema, updateAssignmentSchema } from '../services/homeworkValidation';
import type { CreateAssignmentInput, UpdateAssignmentInput, Assignment } from '../types/homework.types';
import { useBatches } from '@/modules/batches';
import { useSubjects } from '@/modules/subjects';

interface HomeworkFormProps {
    assignment?: Assignment; // Optional assignment for edit mode
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function HomeworkForm({ assignment, onSuccess, onCancel }: HomeworkFormProps) {
    const isEdit = !!assignment;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(assignment?.fileUrl || null);
    const { showToast } = useToast();
    const { batches } = useBatches();
    const { subjects } = useSubjects({ batchId: assignment?.batchId || undefined });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(isEdit ? updateAssignmentSchema : createAssignmentSchema) as any,
        defaultValues: isEdit
            ? {
                  title: assignment.title,
                  description: assignment.description || '',
                  batchId: assignment.batchId,
                  subjectId: assignment.subjectId || '',
                  dueDate: assignment.dueDate
                      ? new Date(assignment.dueDate).toISOString().slice(0, 16)
                      : '',
              }
            : {
                  title: '',
                  description: '',
                  batchId: '',
                  subjectId: '',
                  dueDate: '',
              },
    });

    const selectedBatchId = watch('batchId');
    const { subjects: batchSubjects } = useSubjects({ batchId: selectedBatchId || undefined });

    const onSubmit = async (data: CreateAssignmentInput | UpdateAssignmentInput) => {
        try {
            setIsSubmitting(true);
            const url = isEdit ? `/api/homework/${assignment.id}` : '/api/homework';
            const method = isEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    fileUrl: fileUrl || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save assignment');
            }

            showToast({
                message: isEdit ? 'Assignment updated successfully' : 'Assignment created successfully',
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

    const handleFileUpload = async (file: File) => {
        try {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append('file', file);

            // Determine file type
            const isPDF = file.type === 'application/pdf';
            const uploadUrl = isPDF ? '/api/content/upload/pdf' : '/api/content/upload/image';

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const result = await response.json();
            setFileUrl(result.data.url);
            showToast({
                message: 'File uploaded successfully',
                variant: 'success',
            });
        } catch (error) {
            showToast({
                message: (error as Error).message,
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const batchOptions = batches.map((batch) => ({
        label: batch.name,
        value: batch.id,
    }));

    const subjectOptions = (batchSubjects || []).map((subject) => ({
        label: subject.name,
        value: subject.id,
    }));

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Title"
                {...register('title')}
                error={errors.title?.message as string | undefined}
                required
            />

            <Textarea
                label="Description"
                {...register('description')}
                error={errors.description?.message as string | undefined}
                rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Batch"
                    {...register('batchId')}
                    options={[{ label: 'Select Batch', value: '' }, ...batchOptions]}
                    error={errors.batchId?.message as string | undefined}
                    required={!isEdit}
                    disabled={isEdit}
                />

                <Select
                    label="Subject (Optional)"
                    {...register('subjectId')}
                    options={[
                        { label: 'No Subject', value: '' },
                        ...subjectOptions,
                    ]}
                    error={errors.subjectId?.message as string | undefined}
                    disabled={!selectedBatchId}
                />
            </div>

            <Input
                label="Due Date (Optional)"
                type="datetime-local"
                {...register('dueDate')}
                error={errors.dueDate?.message as string | undefined}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment File (Optional)
                </label>
                <FileUpload
                    onFileSelect={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSizeMB={10}
                />
                {fileUrl && (
                    <p className="text-sm text-green-600 mt-2">
                        File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                    </p>
                )}
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    {isEdit ? 'Update Assignment' : 'Create Assignment'}
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

export default HomeworkForm;

