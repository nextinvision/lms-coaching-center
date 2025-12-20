// Sidebar Component
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/modules/auth';
import { useUIStore } from '@/shared/store/uiStore';
import { cn } from '@/shared/utils/cn';
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

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
        roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    },
    {
        label: 'Notes',
        href: '/student/notes',
        icon: <BookOpen className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: 'Tests',
        href: '/student/tests',
        icon: <FileText className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: 'Homework',
        href: '/student/homework',
        icon: <ClipboardList className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: 'Attendance',
        href: '/student/attendance',
        icon: <Calendar className="h-5 w-5" />,
        roles: ['STUDENT'],
    },
    {
        label: 'Content',
        href: '/teacher/content',
        icon: <FolderOpen className="h-5 w-5" />,
        roles: ['TEACHER'],
    },
    {
        label: 'Students',
        href: '/teacher/students',
        icon: <Users className="h-5 w-5" />,
        roles: ['TEACHER'],
    },
    {
        label: 'Students',
        href: '/admin/students',
        icon: <Users className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: 'Teachers',
        href: '/admin/teachers',
        icon: <UserCog className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: 'Notices',
        href: '/admin/notices',
        icon: <Bell className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: 'Reports',
        href: '/admin/reports',
        icon: <BarChart3 className="h-5 w-5" />,
        roles: ['ADMIN'],
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: <Settings className="h-5 w-5" />,
        roles: ['STUDENT', 'TEACHER', 'ADMIN'],
    },
];

export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const { sidebarOpen, setSidebarOpen } = useUIStore();

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
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                                            isActive
                                                ? 'bg-blue-50 text-blue-600 font-medium'
                                                : 'text-gray-700 hover:bg-gray-100'
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
