// useSubjects Hook
'use client';

import { useState, useEffect } from 'react';
import { useSubjectStore } from '../store/subjectStore';
import type { SubjectFilters } from '../types/subject.types';

export function useSubjects(filters?: SubjectFilters) {
    const { subjects, isLoading, error, setSubjects, setLoading, setError } = useSubjectStore();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, [filters?.batchId, filters?.search]);

    const fetchSubjects = async () => {
        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.batchId) queryParams.append('batchId', filters.batchId);
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/subjects?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch subjects');
            }

            const result = await response.json();
            setSubjects(result.data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    return {
        subjects,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchSubjects,
    };
}

export default useSubjects;

