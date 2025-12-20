// useSearch Hook
'use client';

import { useState, useMemo } from 'react';

export interface UseSearchOptions<T> {
    data: T[];
    searchKeys: (keyof T)[];
    searchTerm?: string;
}

export function useSearch<T extends Record<string, any>>({
    data,
    searchKeys,
    searchTerm: initialSearchTerm = '',
}: UseSearchOptions<T>) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) {
            return data;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();

        return data.filter((item) => {
            return searchKeys.some((key) => {
                const value = item[key];
                if (value === null || value === undefined) {
                    return false;
                }
                return String(value).toLowerCase().includes(lowerSearchTerm);
            });
        });
    }, [data, searchKeys, searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        filteredData,
        resultsCount: filteredData.length,
    };
}

export default useSearch;

