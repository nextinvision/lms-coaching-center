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
import { youtubeUtils } from '@/core/storage/youtube';
import { requestDeduplication } from '@/core/utils/requestDeduplication';
import { Upload, X } from 'lucide-react';
import useTranslation from '@/core/i18n/useTranslation';

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
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
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
            } else if (file.type.startsWith('video/')) {
                type = 'VIDEO';
            }

            setContentType(type);
            setValue('type', type);

            // Upload file based on type
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('batchId', batchId);
            const currentSubjectId = watch('subjectId');
            if (currentSubjectId) formData.append('subjectId', currentSubjectId);

            // Determine upload endpoint
            let uploadEndpoint = '/api/content/upload/image';
            if (type === 'PDF') {
                uploadEndpoint = '/api/content/upload/pdf';
            } else if (type === 'VIDEO') {
                uploadEndpoint = '/api/content/upload/video';
            }

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
                message: t('content.fileUploaded'),
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

    const handleYouTubeUrl = async () => {
        if (!youtubeUrl || !youtubeUrl.trim()) {
            showToast({
                message: t('content.enterUrl'),
                variant: 'error',
            });
            return;
        }

        try {
            // Trim whitespace from URL
            const trimmedUrl = youtubeUrl.trim();
            
            // Validate and get video info
            const videoInfo = youtubeUtils.getVideoInfo(trimmedUrl);

            if (!videoInfo.isValid || !videoInfo.videoId) {
                showToast({
                    message: t('content.invalidUrl'),
                    variant: 'error',
                });
                return;
            }

            // Set form values
            setContentType('VIDEO');
            setValue('type', 'VIDEO');
            setValue('fileUrl', videoInfo.embedUrl || trimmedUrl);
            setUploadedFileUrl(videoInfo.embedUrl || trimmedUrl);
            
            // Set fileName to video title or video ID
            setValue('fileName', `YouTube Video - ${videoInfo.videoId}`);

            // Show success feedback
            showToast({
                message: `${t('content.validated')}! Video ID: ${videoInfo.videoId}`,
                variant: 'success',
            });
        } catch (error) {
            console.error('YouTube URL validation error:', error);
            showToast({
                message: t('content.invalidUrl'),
                variant: 'error',
            });
        }
    };

    const onSubmit = async (data: CreateContentInput) => {
        if (!uploadedFileUrl) {
            showToast({
                message: t('content.uploadOrUrl'),
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
                message: t('content.contentCreated'),
                variant: 'success',
            });

            // Invalidate content cache for this batch to show new content immediately
            if (batchId) {
                requestDeduplication.invalidate(new RegExp(`^/api/content/batch/${batchId}`));
                requestDeduplication.invalidate(new RegExp(`^/api/content\\?.*batchId=${batchId}`));
            }

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
                label={t('content.title')}
                {...register('title')}
                error={errors.title?.message}
                required
            />

            <Textarea
                label={t('content.description')}
                {...register('description')}
                error={errors.description?.message}
                rows={3}
            />

            <Select
                label={t('content.contentType')}
                {...register('type')}
                onChange={(e) => {
                    setContentType(e.target.value as 'PDF' | 'IMAGE' | 'VIDEO');
                    setValue('type', e.target.value as 'PDF' | 'IMAGE' | 'VIDEO');
                }}
                options={[
                    { label: t('content.pdf'), value: 'PDF' },
                    { label: t('content.image'), value: 'IMAGE' },
                    { label: t('content.videoYouTube'), value: 'VIDEO' },
                ]}
                error={errors.type?.message}
                required
            />

            {contentType !== 'VIDEO' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('content.uploadFile')}
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
                        {t('content.youtubeUrl')}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            value={youtubeUrl}
                            onChange={(e) => {
                                setYoutubeUrl(e.target.value);
                                // Clear uploaded URL if user changes the YouTube URL
                                if (uploadedFileUrl) {
                                    setUploadedFileUrl(null);
                                    setValue('fileUrl', '');
                                }
                            }}
                            placeholder={t('content.pasteYoutubeUrl')}
                            className="flex-1"
                        />
                        <Button 
                            type="button" 
                            onClick={handleYouTubeUrl}
                            disabled={!youtubeUrl.trim() || isSubmitting}
                        >
                            {t('content.validate')}
                        </Button>
                    </div>
                    {uploadedFileUrl && youtubeUtils.getVideoInfo(youtubeUrl).isValid && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-green-700 font-medium">
                                        ✓ {t('content.validated')}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setYoutubeUrl('');
                                        setUploadedFileUrl(null);
                                        setValue('fileUrl', '');
                                    }}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Clear URL"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {youtubeUtils.getVideoInfo(youtubeUrl).videoId && (
                                <p className="text-xs text-green-600 mt-1">
                                    Video ID: {youtubeUtils.getVideoInfo(youtubeUrl).videoId}
                                </p>
                            )}
                        </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {t('content.supportedFormats')}
                    </p>
                </div>
            )}

            <Select
                label={`${t('content.subject')} (${t('common.select')})`}
                {...register('subjectId')}
                options={[
                    { label: t('content.noSubject'), value: '' },
                    ...subjectOptions,
                ]}
                error={errors.subjectId?.message}
            />

            <Input
                label={`${t('content.chapterName')} (${t('common.select')})`}
                {...register('chapterName')}
                error={errors.chapterName?.message}
            />

            <Select
                label={t('content.language')}
                {...register('language')}
                options={[
                    { label: t('content.english'), value: 'EN' },
                    { label: t('content.assamese'), value: 'AS' },
                ]}
                error={errors.language?.message}
                required
            />

            <div className="flex gap-4 pt-4">
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('content.uploadContent')}
                </Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {t('common.cancel')}
                    </Button>
                )}
            </div>
        </form>
    );
}

export default ContentUpload;

