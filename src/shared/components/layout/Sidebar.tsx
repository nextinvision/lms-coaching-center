// Sidebar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { useUIStore } from '@/shared/store/uiStore';
import { cn } from '@/shared/utils/cn';
import useTranslation from '@/core/i18n/useTranslation';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    ClipboardList,
    Calendar,
    Users,
    UserCog,
    Settings,
    Bell,
    BarChart3,
    FolderOpen,
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles: string[];
}

// Helper function to get dashboard URL by role
const getDashboardUrl = (role: string): string => {
    switch (role) {
        case 'STUDENT':
            return '/student/dashboard';
        case 'TEACHER':
            return '/teacher/dashboard';
        case 'ADMIN':
            return '/admin/dashboard';
        default:
            return '/dashboard';
    }
};

// Navigation items will be generated dynamically with translations
const getNavItems = (t: (key: string) => string): NavItem[] => [
    {
        label: t('student.dashboard'),
        href: '/dashboard', // Will be replaced dynamically
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    },
    {
        label: t('student.notes'),
        href: '/student/notes',
        icon: <BookOpen className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: t('student.tests'),
        href: '/student/tests',
        icon: <FileText className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: t('student.homework'),
        href: '/student/homework',
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: t('student.attendance'),
        href: '/student/attendance',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: t('teacher.content'),
        href: '/teacher/content',
        icon: <FolderOpen className="h-5 w-5" />,
        roles: ['TEACHER'],
    },
    {
        label: t('teacher.students'),
        href: '/teacher/students',
        icon: <Users className="h-5 w-5" />,
        roles: ['TEACHER'],
    },
    {
        label: t('admin.students'),
        href: '/admin/students',
        icon: <Users className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: t('admin.teachers'),
        href: '/admin/teachers',
        icon: <UserCog className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: t('admin.notices'),
        href: '/admin/notices',
        icon: <Bell className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: t('admin.reports'),
        href: '/admin/reports',
        icon: <BarChart3 className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: t('common.settings'),
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
        roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    },
];

export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const { sidebarOpen, setSidebarOpen } = useUIStore();
    const { t } = useTranslation();

    const navItems = getNavItems(t);
    const filteredNavItems = navItems.filter((item) =>
        user ? item.roles.includes(user.role) : false
    );

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <nav className="h-full overflow-y-auto p-4">
                    <ul className="space-y-1">
                        {filteredNavItems.map((item) => {
                            // Get dynamic href for Dashboard based on user role
                            const isDashboard = item.label === t('student.dashboard') || item.label === t('teacher.dashboard') || item.label === t('admin.dashboard');
                            const href = isDashboard && user ? getDashboardUrl(user.role) : item.href;
                            const isActive = pathname === href || pathname.startsWith(href + '/');

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={href}
                                        className={cn(
                                            'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                                            isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-800 hover:bg-gray-100'
                                        )}
                                        onClick={() => {
                                            // Close sidebar on mobile after clicking
                                            if (window.innerWidth < 1024) {
                                                setSidebarOpen(false);
                                            }
                                        }}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
