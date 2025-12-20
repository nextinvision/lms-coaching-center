// Login Form Component
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin, loginSchema, type LoginInput } from '@/modules/auth';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Alert } from '@/shared/components/ui/Alert';
import { Mail, Lock } from 'lucide-react';
import useTranslation from '@/core/i18n/useTranslation';

export const LoginForm: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const { login, isLoading, error } = useLogin();
    const [showError, setShowError] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setShowError(false);
            await login(data);
            // Redirect is handled by useLogin hook
        } catch (err) {
            setShowError(true);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {showError && error && (
                <Alert variant="error" onClose={() => setShowError(false)}>
                    {error}
                </Alert>
            )}

            <Input
                label={t('auth.email')}
                type="email"
                placeholder={t('auth.enterEmail')}
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
            />

            <Input
                label={t('auth.password')}
                type="password"
                placeholder={t('auth.enterPassword')}
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
                {t('auth.signIn')}
            </Button>
        </form>
    );
};

export default LoginForm;
