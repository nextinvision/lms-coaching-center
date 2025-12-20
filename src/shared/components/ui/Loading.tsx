'use client';

import React from 'react';

interface LoadingProps {
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = true, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 border-2',
        md: 'w-16 sm:w-20 aspect-square border-4',
        lg: 'w-24 sm:w-28 aspect-square border-[6px]',
    };

    const containerClasses = fullScreen
        ? 'min-h-screen flex items-center justify-center'
        : 'flex items-center justify-center p-4';

    return (
        <div className={containerClasses}>
            <div
                className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin`}
            ></div>
        </div>
    );
};

export default Loading;
