import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverable = false
}) => {
    const hoverClass = hoverable ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';

    return (
        <div
            className={`bg-white rounded-lg border border-gray-300 shadow-custom-card ${hoverClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
