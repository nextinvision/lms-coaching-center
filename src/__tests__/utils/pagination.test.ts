// Pagination Utilities Tests
import {
    getPaginationParams,
    createPaginationResult,
    parsePaginationQuery,
} from '@/shared/utils/pagination';

describe('Pagination Utilities', () => {
    describe('getPaginationParams', () => {
        it('should return correct pagination params', () => {
            const result = getPaginationParams(2, 20);

            expect(result.page).toBe(2);
            expect(result.limit).toBe(20);
            expect(result.skip).toBe(20);
        });

        it('should handle default values', () => {
            const result = getPaginationParams();

            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
            expect(result.skip).toBe(0);
        });

        it('should enforce minimum values', () => {
            const result = getPaginationParams(0, -5);

            expect(result.page).toBe(1);
            expect(result.limit).toBe(1);
        });

        it('should enforce maximum limit', () => {
            const result = getPaginationParams(1, 200);

            expect(result.limit).toBe(100);
        });
    });

    describe('createPaginationResult', () => {
        it('should create pagination result correctly', () => {
            const data = [1, 2, 3, 4, 5];
            const result = createPaginationResult(data, 25, 2, 5);

            expect(result.data).toHaveLength(5);
            expect(result.pagination.page).toBe(2);
            expect(result.pagination.limit).toBe(5);
            expect(result.pagination.total).toBe(25);
            expect(result.pagination.totalPages).toBe(5);
            expect(result.pagination.hasNext).toBe(true);
            expect(result.pagination.hasPrev).toBe(true);
        });

        it('should handle first page', () => {
            const data = [1, 2, 3];
            const result = createPaginationResult(data, 3, 1, 3);

            expect(result.pagination.hasPrev).toBe(false);
            expect(result.pagination.hasNext).toBe(false);
        });
    });

    describe('parsePaginationQuery', () => {
        it('should parse query parameters', () => {
            const searchParams = { page: '3', limit: '15' };
            const result = parsePaginationQuery(searchParams);

            expect(result.page).toBe(3);
            expect(result.limit).toBe(15);
            expect(result.skip).toBe(30);
        });

        it('should use defaults for missing params', () => {
            const searchParams = {};
            const result = parsePaginationQuery(searchParams);

            expect(result.page).toBe(1);
            expect(result.limit).toBe(10);
        });
    });
});

