// useContent Hook
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useContentStore } from '../store/contentStore';
import type { Content } from '../types/content.types';

export function useContent(contentId: string | null) {
    const { currentContent, isLoading, error, setCurrentContent, setLoading, setError } =
        useContentStore();
    const [isFetching, setIsFetching] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isMountedRef = useRef(true);
    const lastFetchedIdRef = useRef<string | null>(null);

    const fetchContent = useCallback(async (id: string) => {
        // Don't fetch if already fetching the same content
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

            const response = await fetch(`/api/content/${id}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }

            const result = await response.json();
            
            if (isMountedRef.current) {
                setCurrentContent(result.data as Content);
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
    }, [isFetching, isLoading, setCurrentContent, setLoading, setError]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (contentId) {
            fetchContent(contentId);
        } else {
            setCurrentContent(null);
            lastFetchedIdRef.current = null;
        }

        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [contentId, fetchContent, setCurrentContent]);

    return {
        content: currentContent,
        isLoading: isLoading || isFetching,
        error,
        refetch: () => contentId && fetchContent(contentId),
    };
}

export default useContent;

