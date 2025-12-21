// Profile Settings Component
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { useAuth } from '@/modules/auth';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import { Loader } from '@/shared/components/ui/Loader';
import { User, Save, Upload } from 'lucide-react';
import type { UpdateProfileInput } from '../types/settings.types';
import { Language } from '@prisma/client';

export function ProfileSettings() {
    const { user, checkAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
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
        }
    }, [user]);

    const handleChange = (field: keyof UpdateProfileInput, value: string | Language) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
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

            setSuccess('Profile updated successfully');
            // Refresh auth to get updated user data
            await checkAuth();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
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
                    Profile Settings
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
                            label="Full Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />

                        <Input
                            label="Phone"
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />

                        <Input
                            label="Profile Image URL"
                            value={formData.imageUrl || ''}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div>
                        <Select
                            label="Preferred Language"
                            value={formData.preferredLanguage || Language.EN}
                            onChange={(e) => handleChange('preferredLanguage', e.target.value as Language)}
                            options={[
                                { label: 'English', value: Language.EN },
                                { label: 'Assamese', value: Language.AS },
                            ]}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader className="mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

