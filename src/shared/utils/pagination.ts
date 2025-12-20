// Pagination Utilities
export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Calculate pagination parameters
 */
export function getPaginationParams(page: number = 1, limit: number = 10): PaginationParams {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    return {
        page: pageNum,
        limit: limitNum,
        skip,
    };
}

/**
 * Create pagination result
 */
export function createPaginationResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginationResult<T> {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
}

/**
 * Parse pagination query parameters
 */
export function parsePaginationQuery(searchParams: {
    page?: string;
    limit?: string;
}): PaginationParams {
    const page = parseInt(searchParams.page || '1', 10);
    const limit = parseInt(searchParams.limit || '10', 10);

    return getPaginationParams(page, limit);
}

