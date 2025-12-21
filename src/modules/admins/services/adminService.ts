// Admin Service
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';
import type {
    Admin,
    AdminWithDetails,
    CreateAdminInput,
    UpdateAdminInput,
} from '../types/admin.types';

export const adminService = {
    /**
     * Create a new admin (admin only)
     */
    async create(data: CreateAdminInput): Promise<Admin> {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create user and admin profile
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                phone: data.phone || null,
                role: 'ADMIN',
            },
        });

        const admin = await prisma.admin.create({
            data: {
                userId: user.id,
            },
            include: {
                user: true,
            },
        });

        return admin as Admin;
    },

    /**
     * Get admin by ID
     */
    async getById(id: string): Promise<AdminWithDetails | null> {
        const admin = await prisma.admin.findUnique({
            where: { id },
            include: {
                user: true,
            },
        });

        return admin as AdminWithDetails | null;
    },

    /**
     * Get admin by user ID
     */
    async getByUserId(userId: string): Promise<Admin | null> {
        const admin = await prisma.admin.findUnique({
            where: { userId },
            include: {
                user: true,
            },
        });

        return admin as Admin | null;
    },

    /**
     * Get all admins
     */
    async getAll(): Promise<AdminWithDetails[]> {
        const admins = await prisma.admin.findMany({
            include: {
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return admins as AdminWithDetails[];
    },

    /**
     * Update admin
     */
    async update(id: string, data: UpdateAdminInput): Promise<Admin> {
        const admin = await prisma.admin.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!admin) {
            throw new Error('Admin not found');
        }

        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.phone !== undefined) {
            updateData.phone = data.phone;
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await prisma.user.update({
            where: { id: admin.userId },
            data: updateData,
        });

        const updatedAdmin = await prisma.admin.findUnique({
            where: { id },
            include: { user: true },
        });

        return updatedAdmin as Admin;
    },

    /**
     * Delete admin
     */
    async delete(id: string): Promise<void> {
        const admin = await prisma.admin.findUnique({
            where: { id },
        });

        if (!admin) {
            throw new Error('Admin not found');
        }

        // Delete admin profile (user will be deleted via cascade)
        await prisma.admin.delete({
            where: { id },
        });
    },
};

export default adminService;

