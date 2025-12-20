// Batch Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Batch, BatchWithDetails, BatchStats } from '../types/batch.types';

interface BatchState {
    batches: Batch[];
    currentBatch: BatchWithDetails | null;
    stats: BatchStats | null;
    isLoading: boolean;
    error: string | null;

    setBatches: (batches: Batch[]) => void;
    setCurrentBatch: (batch: BatchWithDetails | null) => void;
    setStats: (stats: BatchStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useBatchStore = create<BatchState>((set) => ({
    batches: [],
    currentBatch: null,
    stats: null,
    isLoading: false,
    error: null,

    setBatches: (batches) => set({ batches }),
    setCurrentBatch: (batch) => set({ currentBatch: batch }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

