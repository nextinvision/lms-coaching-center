// API Client
import type { ApiResponse } from '@/shared/types/common.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export class ApiClient {
    private baseURL: string;
    private defaultHeaders: HeadersInit;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;

        // Get auth token from localStorage
        const token =
            typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Merge additional headers
        if (options.headers) {
            Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
                headers[key] = value;
            });
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'An error occurred',
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: (error as Error).message,
            };
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient();

export default apiClient;
