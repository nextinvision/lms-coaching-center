// Authentication Service
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/core/database/prisma';
import type { LoginCredentials, LoginResponse, AuthUser } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const { email, password } = credentials;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                studentProfile: true,
                teacherProfile: true,
                adminProfile: true,
            },
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!user.isActive) {
            throw new Error('Account is inactive');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        // Create session
        const session = await prisma.session.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        // Remove password from response and transform to AuthUser
        const { password: _, ...userWithoutPassword } = user;

        const authUser: AuthUser = {
            ...userWithoutPassword,
            studentProfile: user.studentProfile || undefined,
            teacherProfile: user.teacherProfile || undefined,
            adminProfile: user.adminProfile || undefined,
        };

        return {
            user: authUser,
            token,
            expiresAt: session.expiresAt,
        };
    },

    /**
     * Logout user
     */
    async logout(token: string): Promise<void> {
        await prisma.session.delete({
            where: { token },
        });
    },

    /**
     * Verify token and get user
     */
    async verifyToken(token: string): Promise<AuthUser | null> {
        try {
            // Verify JWT
            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                email: string;
                role: string;
            };

            // Check if session exists and is not expired
            const session = await prisma.session.findUnique({
                where: { token },
            });

            if (!session || session.expiresAt < new Date()) {
                return null;
            }

            // Get user
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                include: {
                    studentProfile: true,
                    teacherProfile: true,
                    adminProfile: true,
                },
            });

            if (!user || !user.isActive) {
                return null;
            }

            const { password: _, ...userWithoutPassword } = user;

            const authUser: AuthUser = {
                ...userWithoutPassword,
                studentProfile: user.studentProfile || undefined,
                teacherProfile: user.teacherProfile || undefined,
                adminProfile: user.adminProfile || undefined,
            };

            return authUser;
        } catch (error) {
            return null;
        }
    },

    /**
     * Get current user from token
     */
    async getCurrentUser(token: string): Promise<AuthUser | null> {
        return this.verifyToken(token);
    },

    /**
     * Change password
     */
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    },

    /**
     * Hash password
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    },

    /**
     * Clean up expired sessions
     */
    async cleanupExpiredSessions(): Promise<void> {
        await prisma.session.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    },
};

export default authService;
