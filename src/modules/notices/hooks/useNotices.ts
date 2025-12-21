// useNotices Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNoticeStore } from '../store/noticeStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { NoticeFilters, Notice } from '../types/notice.types';

export function useNotices(filters?: NoticeFilters) {
    const { notices, isLoading, error, setNotices, setLoading, setError } = useNoticeStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef(false);
    const isFetchingRef = useRef(false);

    // Memoize filters key to prevent unnecessary re-renders
    const filtersKey = useMemo(() => {
        return JSON.stringify({
            batchId: filters?.batchId,
            type: filters?.type,
            isActive: filters?.isActive,
            search: filters?.search,
        });
    }, [filters?.batchId, filters?.type, filters?.isActive, filters?.search]);

    const fetchNotices = useCallback(async () => {
        // Prevent duplicate calls within same render cycle
        if (hasFetchedRef.current && !isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = true;
        isFetchingRef.current = true;

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

            const url = `/api/notices?${queryParams.toString()}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Notice[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setNotices(result.data);
            }
        } catch (err) {
            hasFetchedRef.current = false; // Reset on error to allow retry
            if (err instanceof Error && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // filtersKey already includes all filter deps (batchId, type, isActive, search)
    // isLoading/isFetching cause infinite loops if included in deps
    }, [filtersKey, setNotices, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = false; // Reset on filters change
        fetchNotices();

        return () => {
            isMountedRef.current = false;
        };
    }, [fetchNotices]);

    return {
        notices,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = false;
            return fetchNotices();
        },
    };
}

export default useNotices;

