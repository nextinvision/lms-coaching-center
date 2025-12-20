// Authentication Types
import { UserRole, Language } from '@prisma/client';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    imageUrl: string | null;
    role: UserRole;
    preferredLanguage: Language;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Student {
    id: string;
    userId: string;
    name: string;
    phone: string;
    batchId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Teacher {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Admin {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthUser extends User {
    studentProfile?: Student;
    teacherProfile?: Teacher;
    adminProfile?: Admin;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    token: string;
    expiresAt: Date;
}

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface AuthState {
    user: AuthUser | null;
    session: Session | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface PermissionConfig {
    role: UserRole;
    permissions: string[];
}

export type Permission =
    | 'view_dashboard'
    | 'view_students'
    | 'manage_students'
    | 'view_teachers'
    | 'manage_teachers'
    | 'view_content'
    | 'upload_content'
    | 'delete_content'
    | 'view_tests'
    | 'create_tests'
    | 'grade_tests'
    | 'view_attendance'
    | 'mark_attendance'
    | 'view_homework'
    | 'create_homework'
    | 'view_notices'
    | 'create_notices'
    | 'view_reports'
    | 'manage_batches'
    | 'manage_subjects'
    | 'system_settings';
