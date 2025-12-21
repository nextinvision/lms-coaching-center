// Authentication Service
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/core/database/prisma';
import { getRequestCache, setRequestCache } from '@/core/utils/requestCache';
import type { LoginCredentials, LoginResponse, AuthUser } from '../types/auth.types';

// JWT_SECRET is required for security - no fallbacks allowed
// Get JWT_SECRET lazily (only when needed) to avoid errors on public routes
function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required. Please set it in your .env file and restart the server.');
    }
    return secret;
}
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
            getJwtSecret(),
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
        try {
            // Try to delete session, but don't fail if it doesn't exist
            await prisma.session.delete({
                where: { token },
            });
        } catch (error: unknown) {
            // If session doesn't exist (P2025 error in Prisma), that's okay
            // This can happen if session was already deleted or expired
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
                // Record not found - this is acceptable during logout
                return;
            }
            // Re-throw other errors
            throw error;
        }
        
        // Clear cache for this token
        const { deleteRequestCache } = await import('@/core/utils/requestCache');
        deleteRequestCache(`auth:user:${token}`);
    },

    /**
     * Verify token and get user
     * Uses request-level caching to avoid redundant DB queries
     */
    async verifyToken(token: string): Promise<AuthUser | null> {
        try {
            // Check request cache first
            const cacheKey = `auth:user:${token}`;
            const cached = getRequestCache<AuthUser>(cacheKey);
            if (cached) {
                return cached;
            }

            // Verify JWT (this ensures token is valid before hitting DB)
            jwt.verify(token, getJwtSecret());

            // Optimize: Get session and user in one query instead of two separate queries
            // This reduces from 2 DB queries to 1 DB query
            const session = await prisma.session.findUnique({
                where: { token },
                include: {
                    user: {
                        include: {
                            studentProfile: true,
                            teacherProfile: true,
                            adminProfile: true,
                        },
                    },
                },
            });

            if (!session || session.expiresAt < new Date()) {
                return null;
            }

            const user = session.user;

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

            // Cache for this request
            setRequestCache(cacheKey, authUser);

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
