// Tooltip Component
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/shared/utils/cn';

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    children,
    position = 'top',
    delay = 200,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    let timeoutId: NodeJS.Timeout | null = null;

    const showTooltip = () => {
        timeoutId = setTimeout(() => {
            if (triggerRef.current && tooltipRef.current) {
                const triggerRect = triggerRef.current.getBoundingClientRect();
                const tooltipRect = tooltipRef.current.getBoundingClientRect();

                let top = 0;
                let left = 0;

                switch (position) {
                    case 'top':
                        top = triggerRect.top - tooltipRect.height - 8;
                        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                        break;
                    case 'bottom':
                        top = triggerRect.bottom + 8;
                        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                        break;
                    case 'left':
                        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                        left = triggerRect.left - tooltipRect.width - 8;
                        break;
                    case 'right':
                        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                        left = triggerRect.right + 8;
                        break;
                }

                setTooltipPosition({ top, left });
                setIsVisible(true);
            }
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const positions = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    };

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {isVisible && (
                <div
                    ref={tooltipRef}
                    className={cn(
                        'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg whitespace-nowrap',
                        positions[position],
                        className
                    )}
                    style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                    }}
                >
                    {content}
                    {position === 'top' && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    )}
                    {position === 'bottom' && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                    )}
                    {position === 'left' && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
                    )}
                    {position === 'right' && (
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    )}
                </div>
            )}
        </div>
    );
};

export default Tooltip;

