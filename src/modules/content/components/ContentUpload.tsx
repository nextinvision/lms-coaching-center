// Content Upload Component
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
import { createContentSchema } from '../services/contentValidation';
import type { CreateContentInput } from '../types/content.types';
import { Upload, X } from 'lucide-react';

interface ContentUploadProps {
    batchId: string;
    subjectOptions?: Array<{ label: string; value: string }>;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ContentUpload({
    batchId,
    subjectOptions = [],
    onSuccess,
    onCancel,
}: ContentUploadProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [contentType, setContentType] = useState<'PDF' | 'IMAGE' | 'VIDEO'>('PDF');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CreateContentInput>({
        resolver: zodResolver(createContentSchema),
        defaultValues: {
            batchId,
            type: 'PDF',
            language: 'EN',
            isDownloadable: true,
        },
    });

    const handleFileSelect = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        setSelectedFile(file);

        try {
            setIsSubmitting(true);

            // Determine content type from file
            let type: 'PDF' | 'IMAGE' | 'VIDEO' = 'PDF';
            if (file.type.startsWith('image/')) {
                type = 'IMAGE';
            } else if (file.type === 'application/pdf') {
                type = 'PDF';
            }

            setContentType(type);
            setValue('type', type);

            // Upload file based on type
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('batchId', batchId);

            const uploadEndpoint =
                type === 'PDF' ? '/api/content/upload/pdf' : '/api/content/upload/image';

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload file');
            }

            const result = await response.json();
            setUploadedFileUrl(result.data.url);
            setValue('fileUrl', result.data.url);
            setValue('fileName', file.name);
            setValue('fileSize', file.size);

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

    const handleYouTubeUrl = () => {
        if (!youtubeUrl) return;

        const { youtubeUtils } = require('@/core/storage/youtube');
        const videoInfo = youtubeUtils.getVideoInfo(youtubeUrl);

        if (!videoInfo.isValid) {
            showToast({
                message: 'Invalid YouTube URL',
                variant: 'error',
            });
            return;
        }

        setContentType('VIDEO');
        setValue('type', 'VIDEO');
        setValue('fileUrl', videoInfo.embedUrl || youtubeUrl);
        setUploadedFileUrl(videoInfo.embedUrl || youtubeUrl);
    };

    const onSubmit = async (data: CreateContentInput) => {
        if (!uploadedFileUrl) {
            showToast({
                message: 'Please upload a file or provide a YouTube URL',
                variant: 'error',
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    fileUrl: uploadedFileUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create content');
            }

            showToast({
                message: 'Content created successfully',
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
                label="Title"
                {...register('title')}
                error={errors.title?.message}
                required
            />

            <Textarea
                label="Description"
                {...register('description')}
                error={errors.description?.message}
                rows={3}
            />

            <Select
                label="Content Type"
                {...register('type')}
                onChange={(e) => {
                    setContentType(e.target.value as 'PDF' | 'IMAGE' | 'VIDEO');
                    setValue('type', e.target.value as 'PDF' | 'IMAGE' | 'VIDEO');
                }}
                options={[
                    { label: 'PDF', value: 'PDF' },
                    { label: 'Image', value: 'IMAGE' },
                    { label: 'Video (YouTube)', value: 'VIDEO' },
                ]}
                error={errors.type?.message}
                required
            />

            {contentType !== 'VIDEO' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File
                    </label>
                    <FileUpload
                        accept={contentType === 'PDF' ? '.pdf' : 'image/*'}
                        onFileSelect={handleFileSelect}
                        maxSize={contentType === 'PDF' ? 50 : 10}
                    />
                    {selectedFile && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm text-gray-600">{selectedFile.name}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setUploadedFileUrl(null);
                                }}
                                className="text-red-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {contentType === 'VIDEO' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <Button type="button" onClick={handleYouTubeUrl}>
                            Validate
                        </Button>
                    </div>
                </div>
            )}

            <Select
                label="Subject (Optional)"
                {...register('subjectId')}
                options={[
                    { label: 'No Subject', value: '' },
                    ...subjectOptions,
                ]}
                error={errors.subjectId?.message}
            />

            <Input
                label="Chapter Name (Optional)"
                {...register('chapterName')}
                error={errors.chapterName?.message}
            />

            <Select
                label="Language"
                {...register('language')}
                options={[
                    { label: 'English', value: 'EN' },
                    { label: 'Assamese', value: 'AS' },
                ]}
                error={errors.language?.message}
                required
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Content
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

export default ContentUpload;

