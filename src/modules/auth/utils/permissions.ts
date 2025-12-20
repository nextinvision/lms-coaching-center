// Permission Configuration
import { UserRole } from '@prisma/client';
import type { Permission, PermissionConfig } from '../types/auth.types';

export const PERMISSIONS: Record<UserRole, Permission[]> = {
    STUDENT: [
        'view_dashboard',
        'view_content',
        'view_tests',
        'view_homework',
        'view_attendance',
        'view_notices',
    ],
    TEACHER: [
        'view_dashboard',
        'view_students',
        'view_content',
        'upload_content',
        'view_tests',
        'create_tests',
        'grade_tests',
        'view_homework',
        'create_homework',
        'view_attendance',
        'mark_attendance',
        'view_notices',
    ],
    ADMIN: [
        'view_dashboard',
        'view_students',
        'manage_students',
        'view_teachers',
        'manage_teachers',
        'view_content',
        'upload_content',
        'delete_content',
        'view_tests',
        'create_tests',
        'grade_tests',
        'view_homework',
        'create_homework',
        'view_attendance',
        'mark_attendance',
        'view_notices',
        'create_notices',
        'view_reports',
        'manage_batches',
        'manage_subjects',
        'system_settings',
    ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
    return PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every((permission) => hasPermission(role, permission));
}

export function getRolePermissions(role: UserRole): Permission[] {
    return PERMISSIONS[role];
}

export default PERMISSIONS;
