// Content Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Content, ContentStats } from '../types/content.types';

interface ContentState {
    content: Content[];
    currentContent: Content | null;
    stats: ContentStats | null;
    isLoading: boolean;
    error: string | null;

    setContent: (content: Content[]) => void;
    setCurrentContent: (content: Content | null) => void;
    setStats: (stats: ContentStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
    content: [],
    currentContent: null,
    stats: null,
    isLoading: false,
    error: null,

    setContent: (content) => set({ content }),
    setCurrentContent: (content) => set({ currentContent: content }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

