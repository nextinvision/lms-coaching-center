// useFilter Hook
'use client';

import { useState, useMemo } from 'react';

export interface FilterOption<T = any> {
    key: keyof T;
    value: any;
    operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
}

export interface UseFilterOptions<T> {
    data: T[];
    initialFilters?: FilterOption<T>[];
}

export function useFilter<T extends Record<string, any>>({
    data,
    initialFilters = [],
}: UseFilterOptions<T>) {
    const [filters, setFilters] = useState<FilterOption<T>[]>(initialFilters);

    const filteredData = useMemo(() => {
        if (filters.length === 0) {
            return data;
        }

        return data.filter((item) => {
            return filters.every((filter) => {
                const itemValue = item[filter.key];
                const filterValue = filter.value;

                switch (filter.operator || 'equals') {
                    case 'equals':
                        return itemValue === filterValue;
                    case 'contains':
                        return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'greaterThan':
                        return Number(itemValue) > Number(filterValue);
                    case 'lessThan':
                        return Number(itemValue) < Number(filterValue);
                    case 'in':
                        return Array.isArray(filterValue) && filterValue.includes(itemValue);
                    default:
                        return itemValue === filterValue;
                }
            });
        });
    }, [data, filters]);

    const addFilter = (filter: FilterOption<T>) => {
        setFilters((prev) => [...prev, filter]);
    };

    const removeFilter = (key: keyof T) => {
        setFilters((prev) => prev.filter((f) => f.key !== key));
    };

    const updateFilter = (key: keyof T, value: any, operator?: FilterOption<T>['operator']) => {
        setFilters((prev) => {
            const existing = prev.find((f) => f.key === key);
            if (existing) {
                return prev.map((f) => (f.key === key ? { ...f, value, operator } : f));
            }
            return [...prev, { key, value, operator }];
        });
    };

    const clearFilters = () => {
        setFilters([]);
    };

    return {
        filters,
        filteredData,
        addFilter,
        removeFilter,
        updateFilter,
        clearFilters,
        hasFilters: filters.length > 0,
    };
}

export default useFilter;

