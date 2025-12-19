'use client';

import React, { useState } from 'react';
import assets from '@/lib/assets';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    initialValue?: string;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    initialValue = '',
    placeholder = 'Search for content, subjects...'
}) => {
    const router = useRouter();
    const [input, setInput] = useState(initialValue);

    const onSearchHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            router.push(`/content?search=${encodeURIComponent(input)}`);
        }
    };

    return (
        <form
            onSubmit={onSearchHandler}
            className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
        >
            <Image
                src={assets.search_icon}
                alt="search icon"
                width={24}
                height={24}
                className="md:w-auto w-10 px-3"
            />
            <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder={placeholder}
                className="w-full h-full outline-none text-gray-500/80 px-2"
            />
            <button
                type="submit"
                className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 hover:bg-blue-700 transition-colors"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;
