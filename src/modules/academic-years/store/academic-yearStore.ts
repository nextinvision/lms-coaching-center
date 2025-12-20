// Academic Year Store (Zustand)
'use client';

import { create } from 'zustand';
import type { AcademicYear, AcademicYearFilters, AcademicYearStats } from '../types/academic-year.types';

interface AcademicYearState {
    academicYears: AcademicYear[];
    currentAcademicYear: AcademicYear | null;
    activeAcademicYear: AcademicYear | null;
    stats: AcademicYearStats | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setAcademicYears: (academicYears: AcademicYear[]) => void;
    setCurrentAcademicYear: (academicYear: AcademicYear | null) => void;
    setActiveAcademicYear: (academicYear: AcademicYear | null) => void;
    setStats: (stats: AcademicYearStats) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAcademicYearStore = create<AcademicYearState>((set) => ({
    academicYears: [],
    currentAcademicYear: null,
    activeAcademicYear: null,
    stats: null,
    isLoading: false,
    error: null,

    setAcademicYears: (academicYears) => set({ academicYears }),
    setCurrentAcademicYear: (academicYear) => set({ currentAcademicYear: academicYear }),
    setActiveAcademicYear: (academicYear) => set({ activeAcademicYear: academicYear }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

