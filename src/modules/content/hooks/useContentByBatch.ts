// useContentByBatch Hook
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useContentStore } from '../store/contentStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Content } from '../types/content.types';

export function useContentByBatch(batchId: string | null) {
    const { content, isLoading, error, setContent, setLoading, setError } = useContentStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false); // Use ref to track fetching state

    // Memoize batchId to prevent unnecessary re-renders
    const batchIdKey = useMemo(() => batchId, [batchId]);

    const fetchContent = useCallback(async () => {
        if (!batchIdKey) {
            setContent([]);
            hasFetchedRef.current = null;
            return;
        }

        // Prevent duplicate calls for the same batch
        if (hasFetchedRef.current === batchIdKey && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = batchIdKey;
        isFetchingRef.current = true; // Set ref immediately

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            const url = `/api/content/batch/${batchIdKey}`;

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Content[] }>(url, {
                ttl: 30000, // Cache for 30 seconds
            });

            if (isMountedRef.current) {
                setContent(result.data);
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
                isFetchingRef.current = false; // Clear ref
            }
        }
    }, [batchIdKey, setContent, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        hasFetchedRef.current = null; // Reset when batchId changes
        fetchContent();

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false; // Reset on unmount
        };
    }, [fetchContent]);

    return {
        content,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            hasFetchedRef.current = null;
            return fetchContent();
        },
    };
}

export default useContentByBatch;

