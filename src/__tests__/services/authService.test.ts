// Auth Service Tests
import { authService } from '@/modules/auth/services/authService';
import prisma from '@/core/database/prisma';
import bcrypt from 'bcryptjs';

// Mock Prisma
jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        session: {
            create: jest.fn(),
        },
    },
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
        const mockUser = {
            id: '1',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'STUDENT',
            name: 'Test User',
            isActive: true,
        };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (prisma.session.create as jest.Mock).mockResolvedValue({
                id: 'session-1',
                userId: '1',
                token: 'mock-token',
            });

            const result = await authService.login({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
            expect(result.user.email).toBe('test@example.com');
        });

        it('should throw error for invalid credentials', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            await expect(
                authService.login({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                })
            ).rejects.toThrow('Invalid credentials');
        });
    });
});

