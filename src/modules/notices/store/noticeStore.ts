// Notice Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Notice, NoticeFilters, NoticeStats } from '../types/notice.types';

interface NoticeState {
    notices: Notice[];
    currentNotice: Notice | null;
    stats: NoticeStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setNotices: (notices: Notice[]) => void;
    setCurrentNotice: (notice: Notice | null) => void;
    setStats: (stats: NoticeStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useNoticeStore = create<NoticeState>((set) => ({
    notices: [],
    currentNotice: null,
    stats: null,
    isLoading: false,
    error: null,

    setNotices: (notices) => set({ notices }),
    setCurrentNotice: (notice) => set({ currentNotice: notice }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

