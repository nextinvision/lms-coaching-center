// useTestTimer Hook
'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTestTimer(durationMinutes: number | null, onTimeUp?: () => void) {
    const [timeLeft, setTimeLeft] = useState<number | null>(durationMinutes ? durationMinutes * 60 : null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (durationMinutes) {
            setTimeLeft(durationMinutes * 60);
        }
    }, [durationMinutes]);

    useEffect(() => {
        if (!isRunning || timeLeft === null || timeLeft <= 0) {
            if (timeLeft === 0 && onTimeUp) {
                onTimeUp();
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    setIsRunning(false);
                    if (onTimeUp) {
                        onTimeUp();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, onTimeUp]);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        if (durationMinutes) {
            setTimeLeft(durationMinutes * 60);
        }
    }, [durationMinutes]);

    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        timeLeft: timeLeft !== null ? timeLeft : null,
        formattedTime: timeLeft !== null ? formatTime(timeLeft) : '--:--',
        isRunning,
        start,
        pause,
        reset,
        isTimeUp: timeLeft === 0,
    };
}

export default useTestTimer;

