// Pagination Hook
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaginationParams, type PaginationParams } from '@/shared/utils/pagination';

export interface UsePaginationOptions {
    initialPage?: number;
    initialLimit?: number;
    syncWithUrl?: boolean;
}

export interface UsePaginationReturn {
    page: number;
    limit: number;
    skip: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    goToNextPage: () => void;
    goToPrevPage: () => void;
    goToFirstPage: () => void;
    goToLastPage: (totalPages: number) => void;
    paginationParams: PaginationParams;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
    const { initialPage = 1, initialLimit = 10, syncWithUrl = false } = options;
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial values from URL if syncing, otherwise use defaults
    const urlPage = syncWithUrl ? parseInt(searchParams.get('page') || String(initialPage), 10) : initialPage;
    const urlLimit = syncWithUrl ? parseInt(searchParams.get('limit') || String(initialLimit), 10) : initialLimit;

    const [page, setPageState] = useState(urlPage);
    const [limit, setLimitState] = useState(urlLimit);

    const setPage = useCallback(
        (newPage: number) => {
            const pageNum = Math.max(1, newPage);
            setPageState(pageNum);

            if (syncWithUrl) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', String(pageNum));
                router.push(`?${params.toString()}`, { scroll: false });
            }
        },
        [syncWithUrl, router, searchParams]
    );

    const setLimit = useCallback(
        (newLimit: number) => {
            const limitNum = Math.max(1, Math.min(100, newLimit));
            setLimitState(limitNum);
            setPageState(1); // Reset to first page when limit changes

            if (syncWithUrl) {
                const params = new URLSearchParams(searchParams.toString());
                params.set('limit', String(limitNum));
                params.set('page', '1');
                router.push(`?${params.toString()}`, { scroll: false });
            }
        },
        [syncWithUrl, router, searchParams, setPage]
    );

    const goToNextPage = useCallback(() => {
        setPage(page + 1);
    }, [page, setPage]);

    const goToPrevPage = useCallback(() => {
        setPage(page - 1);
    }, [page, setPage]);

    const goToFirstPage = useCallback(() => {
        setPage(1);
    }, [setPage]);

    const goToLastPage = useCallback(
        (totalPages: number) => {
            setPage(totalPages);
        },
        [setPage]
    );

    const paginationParams = useMemo(() => getPaginationParams(page, limit), [page, limit]);

    return {
        page,
        limit,
        skip: paginationParams.skip,
        setPage,
        setLimit,
        goToNextPage,
        goToPrevPage,
        goToFirstPage,
        goToLastPage,
        paginationParams,
    };
}
