// Profile Settings Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { FileUpload } from '@/shared/components/ui/FileUpload';
import { useAuth } from '@/modules/auth';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import { Loader } from '@/shared/components/ui/Loader';
import { useToast } from '@/shared/components/ui/Toast';
import { User, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { UpdateProfileInput } from '../types/settings.types';
import { Language } from '@prisma/client';
import Image from 'next/image';
import useTranslation from '@/core/i18n/useTranslation';

export function ProfileSettings() {
    const { user, checkAuth } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateProfileInput>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        imageUrl: user?.imageUrl || '',
        preferredLanguage: user?.preferredLanguage || Language.EN,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                imageUrl: user.imageUrl || '',
                preferredLanguage: user.preferredLanguage || Language.EN,
            });
            setPreviewUrl(user.imageUrl || null);
        }
    }, [user]);

    const handleChange = (field: keyof UpdateProfileInput, value: string | Language) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleImageUpload = async (files: File[]) => {
        if (files.length === 0) return;

        const file = files[0];
        setIsUploadingImage(true);
        setError(null);

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Only image files are allowed');
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('File size exceeds 5MB limit');
            }

            // Upload to Cloudinary
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/settings/profile/upload-image', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                // Update form data with the uploaded image URL
                setFormData((prev) => ({ ...prev, imageUrl: result.data.url }));
                setPreviewUrl(result.data.url);
                showToast({
                    message: t('messages.uploadSuccess'),
                    variant: 'success',
                });
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            showToast({
                message: errorMessage,
                variant: 'error',
            });
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, imageUrl: null }));
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Validate form data
            if (!formData.name || !formData.email) {
                throw new Error('Name and email are required');
            }

            const response = await fetch('/api/settings/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccess(t('messages.updateSuccess'));
            showToast({
                message: t('messages.updateSuccess'),
                variant: 'success',
            });

            // Force refresh auth to get updated user data
            // Pass true to forceRefresh to bypass cache and get fresh data
            await checkAuth(true);
            
            // Small delay to ensure state updates
            setTimeout(() => {
                // Trigger a re-render by updating preview if imageUrl changed
                if (formData.imageUrl && formData.imageUrl !== previewUrl) {
                    setPreviewUrl(formData.imageUrl);
                }
            }, 100);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
            setError(errorMessage);
            showToast({
                message: errorMessage,
                variant: 'error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader text="Loading profile..." />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('common.settings')} - {t('common.profile')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t('common.fullName')}
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />

                        <Input
                            label={t('auth.email')}
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />

                        <Input
                            label={t('auth.phone')}
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    {/* Profile Image Upload Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            {t('common.profile')} {t('content.image')}
                        </label>
                        
                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="relative inline-block">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                                    <Image
                                        src={previewUrl}
                                        alt="Profile preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    title="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* File Upload */}
                        <FileUpload
                            accept="image/*"
                            maxSize={5}
                            onFileSelect={handleImageUpload}
                            disabled={isUploadingImage}
                            label={previewUrl ? `${t('common.edit')} ${t('common.profile')} ${t('content.image')}` : `${t('content.uploadFile')} ${t('common.profile')} ${t('content.image')}`}
                            helperText={`${t('content.uploadFile')} (${t('common.max')} 5MB). JPG, PNG, WebP`}
                        />

                        {/* Fallback URL Input (Optional) */}
                        <div className="mt-4">
                            <Input
                                label={`${t('common.or')} ${t('content.imageUrl')} (${t('common.select')})`}
                                value={formData.imageUrl || ''}
                                onChange={(e) => {
                                    handleChange('imageUrl', e.target.value);
                                    setPreviewUrl(e.target.value || null);
                                }}
                                placeholder={t('content.pasteImageUrl')}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {t('content.uploadOrUrl')}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Select
                            label={t('common.preferredLanguage')}
                            value={formData.preferredLanguage || Language.EN}
                            onChange={(e) => handleChange('preferredLanguage', e.target.value as Language)}
                            options={[
                                { label: t('content.english'), value: Language.EN },
                                { label: t('content.assamese'), value: Language.AS },
                            ]}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={isSaving || isUploadingImage}>
                            {isSaving ? (
                                <>
                                    <Loader className="mr-2" />
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('common.saveChanges')}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

