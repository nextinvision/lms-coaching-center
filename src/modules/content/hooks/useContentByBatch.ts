// useContentByBatch Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useContentStore } from '../store/contentStore';
import type { Content } from '../types/content.types';

export function useContentByBatch(batchId: string | null) {
    const { content, isLoading, error, setContent, setLoading, setError } = useContentStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedBatchIdRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    const fetchContent = useCallback(async () => {
        if (!batchId) {
            setContent([]);
            lastFetchedBatchIdRef.current = null;
            return;
        }

        // Don't fetch if already fetching the same batch
        if (lastFetchedBatchIdRef.current === batchId && (isFetchingRef.current || isLoading)) {
            return;
        }

        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        lastFetchedBatchIdRef.current = batchId;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/content/batch/${batchId}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setContent(result.data as Content[]);
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError' && isMountedRef.current) {
                setError(err.message);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
                setIsFetching(false);
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [batchId, isLoading, setContent, setLoading, setError]); // Removed isFetching from deps

    useEffect(() => {
        isMountedRef.current = true;
        fetchContent();

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchContent]);

    return {
        content,
        isLoading: isLoading || isFetching,
        error,
        refetch: fetchContent,
    };
}

export default useContentByBatch;

