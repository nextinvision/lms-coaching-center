// Table Component
'use client';

import React from 'react';
import { cn } from '@/shared/utils/cn';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
    striped?: boolean;
    hoverable?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
    ({ className, striped = false, hoverable = false, ...props }, ref) => {
        return (
            <div className="overflow-x-auto">
                <table
                    ref={ref}
                    className={cn(
                        'min-w-full divide-y divide-gray-200',
                        striped && 'divide-y divide-gray-200',
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);

Table.displayName = 'Table';

export const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('bg-gray-50', className)} {...props} />
));

TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('bg-white divide-y divide-gray-200', className)} {...props} />
));

TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
    HTMLTableRowElement,
    React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }
>(({ className, hoverable = false, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            'transition-colors',
            hoverable && 'hover:bg-gray-50 cursor-pointer',
            className
        )}
        {...props}
    />
));

TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<
    HTMLTableCellElement,
    React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
            className
        )}
        {...props}
    />
));

TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<
    HTMLTableCellElement,
    React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)} {...props} />
));

TableCell.displayName = 'TableCell';

export default Table;

