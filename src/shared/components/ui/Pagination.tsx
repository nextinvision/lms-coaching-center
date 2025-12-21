// Pagination Component
'use client';

import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    showPrevNext?: boolean;
    maxVisiblePages?: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const pages: number[] = [];
        const half = Math.floor(maxVisiblePages / 2);

        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start < maxVisiblePages - 1) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={cn('flex items-center justify-center gap-2', className)}>
            {showFirstLast && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
            )}

            {showPrevNext && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}

            {visiblePages.map((page) => (
                <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={cn('min-w-[40px]', currentPage === page && 'font-semibold')}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                >
                    {page}
                </Button>
            ))}

            {showPrevNext && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}

            {showFirstLast && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            )}

            <span className="ml-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
}

