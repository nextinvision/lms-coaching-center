// useNotice Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNoticeStore } from '../store/noticeStore';

export function useNotice(noticeId: string | null) {
    const { currentNotice, isLoading, error, setCurrentNotice, setLoading, setError } =
        useNoticeStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchNotice = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same notice
        if (lastFetchedIdRef.current === id && (isFetching || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedIdRef.current = id;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/notices/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch notice');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentNotice(result.data);
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
    }, [isFetching, isLoading, setCurrentNotice, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (noticeId) {
            fetchNotice(noticeId);
        } else {
            setCurrentNotice(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [noticeId, fetchNotice, setCurrentNotice]);

    return {
        notice: currentNotice,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => noticeId && fetchNotice(noticeId),
    };
}

export default useNotice;

