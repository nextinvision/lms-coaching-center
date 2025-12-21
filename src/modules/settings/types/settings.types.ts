// Settings Types
import { Language } from '@prisma/client';

export interface UpdateProfileInput {
    name?: string;
    email?: string;
    phone?: string | null;
    imageUrl?: string | null;
    preferredLanguage?: Language;
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface SystemStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalBatches: number;
    totalSubjects: number;
    totalContent: number;
    totalTests: number;
    totalNotices: number;
    activeAcademicYear: string | null;
}

export interface SettingsState {
    profile: UpdateProfileInput | null;
    isLoading: boolean;
    error: string | null;
}

