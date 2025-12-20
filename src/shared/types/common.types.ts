// Common TypeScript Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface FileInfo {
    name: string;
    size: number;
    type: string;
    url?: string;
}

export interface TableColumn<T = any> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

export interface FilterOption {
    key: string;
    label: string;
    type: 'text' | 'select' | 'date' | 'dateRange';
    options?: SelectOption[];
}

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ValidationError {
    field: string;
    message: string;
}

export default {};
