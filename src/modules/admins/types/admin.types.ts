// Admin Types
import type { Admin as PrismaAdmin } from '@prisma/client';

export interface Admin {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: string;
        isActive: boolean;
    };
}

export interface AdminWithDetails extends Admin {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        imageUrl: string | null;
        role: string;
        preferredLanguage: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface CreateAdminInput {
    name: string;
    email: string;
    phone?: string | null;
    password: string;
}

export interface UpdateAdminInput {
    name?: string;
    phone?: string | null;
    password?: string;
    isActive?: boolean;
}

