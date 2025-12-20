// Attendance Store (Zustand)
'use client';

import { create } from 'zustand';
import type { Attendance, AttendanceStats, BatchAttendanceSummary } from '../types/attendance.types';

interface AttendanceState {
    attendances: Attendance[];
    currentAttendance: Attendance | null;
    stats: AttendanceStats | null;
    batchSummary: BatchAttendanceSummary | null;
    isLoading: boolean;
    error: string | null;

    setAttendances: (attendances: Attendance[]) => void;
    setCurrentAttendance: (attendance: Attendance | null) => void;
    setStats: (stats: AttendanceStats) => void;
    setBatchSummary: (summary: BatchAttendanceSummary | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
    attendances: [],
    currentAttendance: null,
    stats: null,
    batchSummary: null,
    isLoading: false,
    error: null,

    setAttendances: (attendances) => set({ attendances }),
    setCurrentAttendance: (attendance) => set({ currentAttendance: attendance }),
    setStats: (stats) => set({ stats }),
    setBatchSummary: (summary) => set({ batchSummary: summary }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));

