// usePagination Hook
'use client';

import { useState, useMemo } from 'react';

interface UsePaginationProps {
    totalItems: number;
    itemsPerPage?: number;
    initialPage?: number;
}

export function usePagination({
    totalItems,
    itemsPerPage = 10,
    initialPage = 1,
}: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(initialPage);

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    const startIndex = useMemo(() => {
        return (currentPage - 1) * itemsPerPage;
    }, [currentPage, itemsPerPage]);

    const endIndex = useMemo(() => {
        return Math.min(startIndex + itemsPerPage, totalItems);
    }, [startIndex, itemsPerPage, totalItems]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        goToPage(currentPage + 1);
    };

    const previousPage = () => {
        goToPage(currentPage - 1);
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        itemsPerPage,
        goToPage,
        nextPage,
        previousPage,
        goToFirstPage,
        goToLastPage,
        hasNextPage,
        hasPreviousPage,
    };
}

export default usePagination;
