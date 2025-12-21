// API Error Handler
import { NextResponse } from 'next/server';
import { errorLogger } from '@/core/utils/errorLogger';

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export function handleApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof Error) {
        // Don't expose internal error messages in production
        const message = process.env.NODE_ENV === 'production' 
            ? 'An error occurred' 
            : error.message;
        return new ApiError(500, message);
    }

    return new ApiError(500, 'An unknown error occurred');
}

export function createErrorResponse(error: ApiError) {
    // Log error
    if (error.statusCode >= 500) {
        errorLogger.error(`API Error: ${error.message}`, error, { details: error.details });
    }

    return NextResponse.json(
        {
            success: false,
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && error.details ? { details: error.details } : {}),
        },
        { status: error.statusCode }
    );
}

export default {
    ApiError,
    handleApiError,
    createErrorResponse,
};
