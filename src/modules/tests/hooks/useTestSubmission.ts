// useTestSubmission Hook
'use client';

import { useState } from 'react';
import { useTestStore } from '../store/testStore';
import type { SubmitTestInput } from '../types/test.types';

export function useTestSubmission() {
    const { setCurrentSubmission, setLoading, setError } = useTestStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submitTest = async (testId: string, data: SubmitTestInput) => {
        try {
            setIsSubmitting(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/tests/${testId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit test');
            }

            const result = await response.json();
            setCurrentSubmission(result.data);
            return result.data;
        } catch (err) {
            const errorMessage = (err as Error).message;
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    return {
        submitTest,
        isSubmitting,
    };
}

export default useTestSubmission;

