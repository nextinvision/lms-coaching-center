// Settings Service
import bcrypt from 'bcryptjs';
import prisma from '@/core/database/prisma';
import type { UpdateProfileInput, ChangePasswordInput, SystemStats as SystemStatsType } from '../types/settings.types';
import { Language } from '@prisma/client';

export const settingsService = {
    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileInput): Promise<void> {
        const updateData: any = {};

        if (data.name !== undefined) {
            updateData.name = data.name;
        }

        if (data.email !== undefined) {
            // Check if email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email already exists');
            }

            updateData.email = data.email;
        }

        if (data.phone !== undefined) {
            updateData.phone = data.phone;
        }

        if (data.imageUrl !== undefined) {
            updateData.imageUrl = data.imageUrl;
        }

        if (data.preferredLanguage !== undefined) {
            updateData.preferredLanguage = data.preferredLanguage;
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
    },

    /**
     * Change user password
     */
    async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },

    /**
     * Get system statistics
     */
    async getSystemStats(): Promise<SystemStatsType> {
        const [
            totalUsers,
            totalStudents,
            totalTeachers,
            totalAdmins,
            totalBatches,
            totalSubjects,
            totalContent,
            totalTests,
            totalNotices,
            activeAcademicYear,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'STUDENT' } }),
            prisma.user.count({ where: { role: 'TEACHER' } }),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.batch.count(),
            prisma.subject.count(),
            prisma.content.count(),
            prisma.test.count(),
            prisma.notice.count(),
            prisma.academicYear.findFirst({
                where: { isActive: true },
                select: { year: true },
            }),
        ]);

        return {
            totalUsers,
            totalStudents,
            totalTeachers,
            totalAdmins,
            totalBatches,
            totalSubjects,
            totalContent,
            totalTests,
            totalNotices,
            activeAcademicYear: activeAcademicYear?.year || null,
        };
    },
};

