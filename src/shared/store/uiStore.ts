// UI Store (Zustand)
'use client';

import { create } from 'zustand';

interface UIState {
    // Sidebar
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;

    // Modals
    modalOpen: string | null;
    openModal: (modalId: string) => void;
    closeModal: () => void;

    // Notifications/Toast
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;

    // Loading states
    loading: Record<string, boolean>;
    setLoading: (key: string, loading: boolean) => void;
}

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

export const useUIStore = create<UIState>((set) => ({
    // Sidebar
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // Modals
    modalOpen: null,
    openModal: (modalId) => set({ modalOpen: modalId }),
    closeModal: () => set({ modalOpen: null }),

    // Notifications
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                { ...notification, id: Math.random().toString(36).substr(2, 9) },
            ],
        })),
    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    // Loading states
    loading: {},
    setLoading: (key, loading) =>
        set((state) => ({
            loading: { ...state.loading, [key]: loading },
        })),
}));

export default useUIStore;
