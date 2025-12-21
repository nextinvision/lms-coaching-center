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
 * Optimize Prisma query with pagination and select only needed fields
 */
export function optimizeQuery<T extends QueryOptions>(options: T): T {
    const optimized: any = { ...options };

    // Limit take to prevent excessive queries
    if (optimized.take && optimized.take > 100) {
        optimized.take = 100;
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

