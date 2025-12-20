// Teacher Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Teacher, TeacherWithDetails, TeacherFilters, TeacherStats } from '../types/teacher.types';

interface TeacherState {
    teachers: Teacher[];
    currentTeacher: TeacherWithDetails | null;
    stats: TeacherStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setTeachers: (teachers: Teacher[]) => void;
    setCurrentTeacher: (teacher: TeacherWithDetails | null) => void;
    setStats: (stats: TeacherStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useTeacherStore = create<TeacherState>((set) => ({
    teachers: [],
    currentTeacher: null,
    stats: null,
    isLoading: false,
    error: null,

    setTeachers: (teachers) => set({ teachers }),
    setCurrentTeacher: (teacher) => set({ currentTeacher: teacher }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

