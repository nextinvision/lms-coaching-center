// API Error Handler
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof Error) {
        return new ApiError(500, error.message);
    }

    return new ApiError(500, 'An unknown error occurred');
}

export function createErrorResponse(error: ApiError) {
    return Response.json(
        {
            success: false,
            error: error.message,
            details: error.details,
        },
        { status: error.statusCode }
    );
}

export default {
    ApiError,
    handleApiError,
    createErrorResponse,
};
