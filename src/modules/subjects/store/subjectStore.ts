// Subject Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Subject } from '../types/subject.types';

interface SubjectState {
    subjects: Subject[];
    currentSubject: Subject | null;
    isLoading: boolean;
    error: string | null;

    setSubjects: (subjects: Subject[]) => void;
    setCurrentSubject: (subject: Subject | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
    subjects: [],
    currentSubject: null,
    isLoading: false,
    error: null,

    setSubjects: (subjects) => set({ subjects }),
    setCurrentSubject: (subject) => set({ currentSubject: subject }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

