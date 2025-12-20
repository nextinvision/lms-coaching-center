// Student Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Student, StudentWithStats, StudentFilters, StudentStats } from '../types/student.types';

interface StudentState {
    students: Student[];
    currentStudent: StudentWithStats | null;
    stats: StudentStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setStudents: (students: Student[]) => void;
    setCurrentStudent: (student: StudentWithStats | null) => void;
    setStats: (stats: StudentStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useStudentStore = create<StudentState>((set) => ({
    students: [],
    currentStudent: null,
    stats: null,
    isLoading: false,
    error: null,

    setStudents: (students) => set({ students }),
    setCurrentStudent: (student) => set({ currentStudent: student }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

