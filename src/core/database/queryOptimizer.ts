// Database Query Optimization Utilities
import { Prisma } from '@prisma/client';

export interface QueryOptions {
    skip?: number;
    take?: number;
    orderBy?: Prisma.Enumerable<any>;
    where?: any;
    include?: any;
    select?: any;
}

/**
 * Maximum limit for query results to prevent excessive data fetching
 */
const MAX_LIMIT = 1000;

/**
 * Default limit when no limit is specified
 */
const DEFAULT_LIMIT = 100;

/**
 * Optimize Prisma query with pagination and select only needed fields
 */
export function optimizeQuery<T extends QueryOptions>(options: T): T {
    const optimized: any = { ...options };

    // Enforce maximum limit to prevent excessive queries
    if (optimized.take && optimized.take > MAX_LIMIT) {
        optimized.take = MAX_LIMIT;
    }

    // Add default limit if not specified and no skip (to prevent fetching all records)
    if (!optimized.take && !optimized.skip) {
        optimized.take = DEFAULT_LIMIT;
    }

    // Add default ordering if not specified
    if (!optimized.orderBy) {
        optimized.orderBy = { createdAt: 'desc' };
    }

    return optimized as T;
}

/**
 * Create efficient count query
 */
export function createCountQuery(where?: any) {
    return {
        where: where || {},
    };
}

/**
 * Batch query helper for large datasets
 */
export async function batchQuery<T>(
    queryFn: (skip: number, take: number) => Promise<T[]>,
    batchSize: number = 100
): Promise<T[]> {
    const results: T[] = [];
    let skip = 0;
    let hasMore = true;

    while (hasMore) {
        const batch = await queryFn(skip, batchSize);
        results.push(...batch);
        hasMore = batch.length === batchSize;
        skip += batchSize;
    }

    return results;
}

/**
 * Apply query limits to a Prisma findMany query options
 * Ensures all queries have reasonable limits to prevent excessive data fetching
 */
export function applyQueryLimits<T extends { take?: number; skip?: number }>(
    options: T
): T {
    const optimized = { ...options };

    // Enforce maximum limit
    if (optimized.take && optimized.take > MAX_LIMIT) {
        optimized.take = MAX_LIMIT;
    }

    // Add default limit if not specified and no skip
    // Skip is allowed without take for pagination scenarios
    if (!optimized.take && !optimized.skip) {
        optimized.take = DEFAULT_LIMIT;
    }

    return optimized as T;
}

/**
 * Export constants for use in services
 */
export { MAX_LIMIT, DEFAULT_LIMIT };

