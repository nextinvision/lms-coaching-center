// Roles Configuration
import { UserRole } from '@prisma/client';

export const ROLE_LABELS: Record<UserRole, string> = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    ADMIN: 'Administrator',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    STUDENT: 'Can view content, take tests, submit homework, and view attendance',
    TEACHER: 'Can upload content, create tests, mark attendance, and manage students',
    ADMIN: 'Can manage all aspects of the system including users, batches, and settings',
};

export const ROLE_COLORS: Record<UserRole, string> = {
    STUDENT: 'blue',
    TEACHER: 'green',
    ADMIN: 'purple',
};

export function getRoleLabel(role: UserRole): string {
    return ROLE_LABELS[role] || role;
}

export function getRoleDescription(role: UserRole): string {
    return ROLE_DESCRIPTIONS[role] || '';
}

export function getRoleColor(role: UserRole): string {
    return ROLE_COLORS[role] || 'gray';
}

export default {
    ROLE_LABELS,
    ROLE_DESCRIPTIONS,
    ROLE_COLORS,
    getRoleLabel,
    getRoleDescription,
    getRoleColor,
};

