// Session Service
import prisma from '@/core/database/prisma';
import type { Session } from '../types/auth.types';

export const sessionService = {
    /**
     * Create new session
     */
    async createSession(userId: string, token: string, expiresAt: Date): Promise<Session> {
        return prisma.session.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    },

    /**
     * Get session by token
     */
    async getSessionByToken(token: string): Promise<Session | null> {
        return prisma.session.findUnique({
            where: { token },
        });
    },

    /**
     * Delete session
     */
    async deleteSession(token: string): Promise<void> {
        await prisma.session.delete({
            where: { token },
        });
    },

    /**
     * Delete all user sessions
     */
    async deleteUserSessions(userId: string): Promise<void> {
        await prisma.session.deleteMany({
            where: { userId },
        });
    },

    /**
     * Check if session is valid
     */
    async isSessionValid(token: string): Promise<boolean> {
        const session = await this.getSessionByToken(token);

        if (!session) {
            return false;
        }

        return session.expiresAt > new Date();
    },

    /**
     * Extend session expiry
     */
    async extendSession(token: string, days: number = 7): Promise<Session> {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);

        return prisma.session.update({
            where: { token },
            data: { expiresAt },
        });
    },
};

export default sessionService;
