// Homework Store (Zustand)
'use client';

import { create } from 'zustand';
import type {
    Assignment,
    AssignmentWithDetails,
    AssignmentSubmission,
    AssignmentFilters,
    AssignmentStats,
} from '../types/homework.types';

interface HomeworkState {
    assignments: Assignment[];
    currentAssignment: AssignmentWithDetails | null;
    submissions: AssignmentSubmission[];
    currentSubmission: AssignmentSubmission | null;
    stats: AssignmentStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setAssignments: (assignments: Assignment[]) => void;
    setCurrentAssignment: (assignment: AssignmentWithDetails | null) => void;
    setSubmissions: (submissions: AssignmentSubmission[]) => void;
    setCurrentSubmission: (submission: AssignmentSubmission | null) => void;
    setStats: (stats: AssignmentStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useHomeworkStore = create<HomeworkState>((set) => ({
    assignments: [],
    currentAssignment: null,
    submissions: [],
    currentSubmission: null,
    stats: null,
    isLoading: false,
    error: null,

    setAssignments: (assignments) => set({ assignments }),
    setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
    setSubmissions: (submissions) => set({ submissions }),
    setCurrentSubmission: (submission) => set({ currentSubmission: submission }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

