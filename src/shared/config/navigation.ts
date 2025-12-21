// Navigation Configuration
import type { UserRole } from '@prisma/client';

export interface NavItem {
    title: string;
    href: string;
    icon?: string;
    description?: string;
    roles?: UserRole[];
}

export const studentNav: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/student/dashboard',
        description: 'Overview of your progress',
    },
    {
        title: 'Notes',
        href: '/student/notes',
        description: 'Access study materials',
    },
    {
        title: 'Tests',
        href: '/student/tests',
        description: 'Take tests and view results',
    },
    {
        title: 'Homework',
        href: '/student/homework',
        description: 'Submit and track homework',
    },
    {
        title: 'Attendance',
        href: '/student/attendance',
        description: 'View attendance records',
    },
];

export const teacherNav: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/teacher/dashboard',
        description: 'Teacher overview',
    },
    {
        title: 'Content',
        href: '/teacher/content',
        description: 'Upload and manage content',
    },
    {
        title: 'Tests',
        href: '/teacher/tests',
        description: 'Create and grade tests',
    },
    {
        title: 'Homework',
        href: '/teacher/homework',
        description: 'Assign and check homework',
    },
    {
        title: 'Attendance',
        href: '/teacher/attendance',
        description: 'Mark attendance',
    },
    {
        title: 'Students',
        href: '/teacher/students',
        description: 'View student list',
    },
];

export const adminNav: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        description: 'System overview',
    },
    {
        title: 'Students',
        href: '/admin/students',
        description: 'Manage students',
    },
    {
        title: 'Teachers',
        href: '/admin/teachers',
        description: 'Manage teachers',
    },
    {
        title: 'Batches',
        href: '/admin/batches',
        description: 'Manage batches',
    },
    {
        title: 'Subjects',
        href: '/admin/subjects',
        description: 'Manage subjects',
    },
    {
        title: 'Notices',
        href: '/admin/notices',
        description: 'Post notices',
    },
    {
        title: 'Reports',
        href: '/admin/reports',
        description: 'View reports',
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        description: 'System settings',
    },
];

export function getNavByRole(role: UserRole): NavItem[] {
    switch (role) {
        case 'STUDENT':
            return studentNav;
        case 'TEACHER':
            return teacherNav;
        case 'ADMIN':
            return adminNav;
        default:
            return [];
    }
}

export default {
    studentNav,
    teacherNav,
    adminNav,
    getNavByRole,
};
