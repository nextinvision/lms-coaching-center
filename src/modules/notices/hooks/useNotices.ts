// useNotices Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNoticeStore } from '../store/noticeStore';
import type { NoticeFilters } from '../types/notice.types';

export function useNotices(filters?: NoticeFilters) {
    const { notices, isLoading, error, setNotices, setLoading, setError } = useNoticeStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFiltersRef = useRef<string>('');

    const fetchNotices = useCallback(async () => {
        // Create a stable key for filters to prevent duplicate requests
        const filtersKey = JSON.stringify({
            batchId: filters?.batchId,
            type: filters?.type,
            isActive: filters?.isActive,
            search: filters?.search,
        });

        // Don't fetch if already fetching with same filters
        if (lastFiltersRef.current === filtersKey && (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFiltersRef.current = filtersKey;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            if (filters?.batchId !== undefined) {
                queryParams.append('batchId', filters.batchId || '');
            }
            if (filters?.type) queryParams.append('type', filters.type);
            if (filters?.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
            if (filters?.search) queryParams.append('search', filters.search);

            const response = await fetch(`/api/notices?${queryParams.toString()}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notices');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setNotices(result.data);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
    }, [filters?.batchId, filters?.type, filters?.isActive, filters?.search, isFetching, isLoading, setNotices, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        fetchNotices();

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchNotices]);

    return {
        notices,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchNotices,
    };
}

export default useNotices;

