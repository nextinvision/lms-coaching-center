// useNotice Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNoticeStore } from '../store/noticeStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Notice } from '../types/notice.types';

export function useNotice(noticeId: string | null) {
    const { currentNotice, isLoading, error, setCurrentNotice, setLoading, setError } =
        useNoticeStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);

    const fetchNotice = useCallback(async (id: string) => {
        // Prevent duplicate calls for the same notice
        if (hasFetchedRef.current === id && !isFetching) {
            return;
        }

        hasFetchedRef.current = id;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/notices/${id}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Notice }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setCurrentNotice(result.data);
            }
        } catch (err) {
            hasFetchedRef.current = null; // Reset on error to allow retry
            if (err instanceof Error && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // isLoading/isFetching cause infinite loops, noticeId is handled separately
    }, [setCurrentNotice, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;

        if (noticeId) {
            hasFetchedRef.current = null; // Reset when noticeId changes
            fetchNotice(noticeId);
        } else {
            setCurrentNotice(null);
            hasFetchedRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [noticeId, fetchNotice, setCurrentNotice]);

    return {
        notice: currentNotice,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            if (noticeId) {
                hasFetchedRef.current = null;
                return fetchNotice(noticeId);
            }
        },
    };
}

export default useNotice;

