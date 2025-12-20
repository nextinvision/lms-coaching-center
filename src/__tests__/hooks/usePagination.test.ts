// usePagination Hook Tests
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/shared/hooks/usePagination';

describe('usePagination Hook', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePagination());

        expect(result.current.page).toBe(1);
        expect(result.current.limit).toBe(10);
        expect(result.current.skip).toBe(0);
    });

    it('should initialize with custom values', () => {
        const { result } = renderHook(() =>
            usePagination({ initialPage: 2, initialLimit: 20 })
        );

        expect(result.current.page).toBe(2);
        expect(result.current.limit).toBe(20);
        expect(result.current.skip).toBe(20);
    });

    it('should change page', () => {
        const { result } = renderHook(() => usePagination());

        act(() => {
            result.current.setPage(2);
        });

        expect(result.current.page).toBe(2);
        expect(result.current.skip).toBe(10);
    });

    it('should change limit and reset to page 1', () => {
        const { result } = renderHook(() => usePagination({ initialPage: 3 }));

        act(() => {
            result.current.setLimit(20);
        });

        expect(result.current.limit).toBe(20);
        expect(result.current.page).toBe(1);
    });

    it('should navigate to next page', () => {
        const { result } = renderHook(() => usePagination({ initialPage: 1 }));

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.page).toBe(2);
    });

    it('should navigate to previous page', () => {
        const { result } = renderHook(() => usePagination({ initialPage: 2 }));

        act(() => {
            result.current.goToPrevPage();
        });

        expect(result.current.page).toBe(1);
    });

    it('should navigate to first page', () => {
        const { result } = renderHook(() => usePagination({ initialPage: 5 }));

        act(() => {
            result.current.goToFirstPage();
        });

        expect(result.current.page).toBe(1);
    });

    it('should navigate to last page', () => {
        const { result } = renderHook(() => usePagination({ initialPage: 1 }));

        act(() => {
            result.current.goToLastPage(10);
        });

        expect(result.current.page).toBe(10);
    });
});

