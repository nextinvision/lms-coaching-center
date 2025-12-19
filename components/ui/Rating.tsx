'use client';

import React, { useEffect, useState } from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';

interface RatingProps {
    initialRating?: number;
    onRate?: (rating: number) => void;
    readOnly?: boolean;
    showCount?: boolean;
    count?: number;
}

const Rating: React.FC<RatingProps> = ({
    initialRating = 0,
    onRate,
    readOnly = false,
    showCount = false,
    count = 0,
}) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    const handleRating = (value: number) => {
        if (!readOnly) {
            setRating(value);
            if (onRate) onRate(value);
        }
    };

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    return (
        <div className="flex items-center gap-2">
            {showCount && <span className="text-sm font-medium">{rating.toFixed(1)}</span>}
            <div className="flex">
                {Array.from({ length: 5 }, (_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= (hover || rating);

                    return (
                        <Image
                            key={index}
                            src={isFilled ? assets.star : assets.star_blank}
                            alt="star"
                            width={16}
                            height={16}
                            className={`w-3.5 h-3.5 ${!readOnly ? 'cursor-pointer' : ''}`}
                            onClick={() => handleRating(starValue)}
                            onMouseEnter={() => !readOnly && setHover(starValue)}
                            onMouseLeave={() => !readOnly && setHover(0)}
                        />
                    );
                })}
            </div>
            {showCount && count > 0 && (
                <span className="text-sm text-gray-500">({count})</span>
            )}
        </div>
    );
};

export default Rating;
