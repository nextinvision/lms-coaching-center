// useSession Hook
'use client';

import { useAuthStore } from '../store/authStore';

export function useSession() {
    const { session, user, isAuthenticated } = useAuthStore();

    const isSessionValid = (): boolean => {
        if (!session) return false;
        return new Date(session.expiresAt) > new Date();
    };

    const getToken = (): string | null => {
        return session?.token || null;
    };

    const getExpiresAt = (): Date | null => {
        return session?.expiresAt || null;
    };

    const getRemainingTime = (): number => {
        if (!session) return 0;
        const now = new Date().getTime();
        const expiresAt = new Date(session.expiresAt).getTime();
        return Math.max(0, expiresAt - now);
    };

    const getRemainingDays = (): number => {
        const remainingMs = getRemainingTime();
        return Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    };

    return {
        session,
        user,
        isAuthenticated,
        isSessionValid: isSessionValid(),
        token: getToken(),
        expiresAt: getExpiresAt(),
        remainingTime: getRemainingTime(),
        remainingDays: getRemainingDays(),
    };
}

export default useSession;
