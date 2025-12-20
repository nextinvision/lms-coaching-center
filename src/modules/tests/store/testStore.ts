// Test Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Test, TestSubmission, TestStats } from '../types/test.types';

interface TestState {
    tests: Test[];
    currentTest: Test | null;
    currentSubmission: TestSubmission | null;
    stats: TestStats | null;
    isLoading: boolean;
    error: string | null;

    setTests: (tests: Test[]) => void;
    setCurrentTest: (test: Test | null) => void;
    setCurrentSubmission: (submission: TestSubmission | null) => void;
    setStats: (stats: TestStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useTestStore = create<TestState>((set) => ({
    tests: [],
    currentTest: null,
    currentSubmission: null,
    stats: null,
    isLoading: false,
    error: null,

    setTests: (tests) => set({ tests }),
    setCurrentTest: (test) => set({ currentTest: test }),
    setCurrentSubmission: (submission) => set({ currentSubmission: submission }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

