// useSubject Hook
'use client';

import { useState, useEffect } from 'react';
import { useSubjectStore } from '../store/subjectStore';

export function useSubject(subjectId: string | null) {
    const { currentSubject, isLoading, error, setCurrentSubject, setLoading, setError } =
        useSubjectStore();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (subjectId) {
            fetchSubject(subjectId);
        } else {
            setCurrentSubject(null);
        }
    }, [subjectId]);

    const fetchSubject = async (id: string) => {
        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/subjects/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subject');
            }

            const result = await response.json();
            setCurrentSubject(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    return {
        subject: currentSubject,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => subjectId && fetchSubject(subjectId),
    };
}

export default useSubject;

