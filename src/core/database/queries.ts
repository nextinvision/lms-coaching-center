// Common database queries and utilities
import prisma from './prisma';
import type { Prisma } from '@prisma/client';

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        include: {
            studentProfile: true,
            teacherProfile: true,
            adminProfile: true,
        },
    });
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            studentProfile: true,
            teacherProfile: true,
            adminProfile: true,
        },
    });
}

/**
 * Create user with profile
 */
export async function createUserWithProfile(
    userData: Prisma.UserCreateInput,
    role: 'STUDENT' | 'TEACHER' | 'ADMIN',
    profileData: any
) {
    return prisma.user.create({
        data: {
            ...userData,
            role,
            ...(role === 'STUDENT' && {
                studentProfile: {
                    create: profileData,
                },
            }),
            ...(role === 'TEACHER' && {
                teacherProfile: {
                    create: profileData,
                },
            }),
            ...(role === 'ADMIN' && {
                adminProfile: {
                    create: profileData,
                },
            }),
        },
        include: {
            studentProfile: true,
            teacherProfile: true,
            adminProfile: true,
        },
    });
}

/**
 * Get active batches
 */
export async function getActiveBatches() {
    return prisma.batch.findMany({
        include: {
            academicYear: true,
            _count: {
                select: {
                    students: true,
                    teachers: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

/**
 * Get batch with details
 */
export async function getBatchWithDetails(batchId: string) {
    return prisma.batch.findUnique({
        where: { id: batchId },
        include: {
            academicYear: true,
            students: {
                include: {
                    user: true,
                },
            },
            subjects: true,
            teachers: {
                include: {
                    teacher: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
        },
    });
}

export default prisma;
