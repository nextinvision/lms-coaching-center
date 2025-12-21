// useContent Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useContentStore } from '../store/contentStore';
import { deduplicatedFetch } from '@/core/utils/requestDeduplication';
import type { Content } from '../types/content.types';

export function useContent(contentId: string | null) {
    const { currentContent, isLoading, error, setCurrentContent, setLoading, setError } =
        useContentStore();
    const [isFetching, setIsFetching] = useState(false);
    const isMountedRef = useRef(true);
    const hasFetchedRef = useRef<string | null>(null);
    const isFetchingRef = useRef(false);

    const fetchContent = useCallback(async (id: string) => {
        // Prevent duplicate calls for the same content
        if (hasFetchedRef.current === id && isFetchingRef.current) {
            return;
        }

        hasFetchedRef.current = id;
        isFetchingRef.current = true;

        try {
            setIsFetching(true);
            setLoading(true);
            setError(null);

            // Use deduplicated fetch - automatically handles caching and deduplication
            const result = await deduplicatedFetch<{ data: Content }>(`/api/content/${id}`, {
                ttl: 60000, // Cache for 60 seconds
            });

            if (isMountedRef.current) {
                setCurrentContent(result.data);
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
                isFetchingRef.current = false;
            }
        }
    }, [setCurrentContent, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;

        if (contentId) {
            hasFetchedRef.current = null; // Reset when contentId changes
            fetchContent(contentId);
        } else {
            setCurrentContent(null);
            hasFetchedRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            isFetchingRef.current = false;
        };
    }, [contentId, fetchContent, setCurrentContent]);

    return {
        content: currentContent,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => {
            if (contentId) {
                hasFetchedRef.current = null;
                return fetchContent(contentId);
            }
        },
    };
}

export default useContent;

