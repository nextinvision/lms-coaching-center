'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    description?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon,
    trend,
    description,
    className,
}: StatsCardProps) {
    const getTrendIcon = () => {
        if (!trend) return null;

        if (trend.value === 0) {
            return <Minus className="h-4 w-4 text-gray-500" />;
        }

        return trend.isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
        );
    };

    const getTrendColor = () => {
        if (!trend || trend.value === 0) return 'text-gray-600';
        return trend.isPositive ? 'text-green-600' : 'text-red-600';
    };

    return (
        <Card className={cn('hover:shadow-lg transition-shadow', className)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        {title}
                    </CardTitle>
                    {icon && <div className="text-gray-400">{icon}</div>}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center gap-1">
                            {getTrendIcon()}
                            <span className={cn('text-sm font-medium', getTrendColor())}>
                                {Math.abs(trend.value).toFixed(1)}%
                            </span>
                            <span className="text-xs text-gray-500">vs last period</span>
                        </div>
                    )}
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default StatsCard;
