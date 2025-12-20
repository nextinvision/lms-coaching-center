// Auth Login API Tests
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { authService } from '@/modules/auth';

jest.mock('@/modules/auth', () => ({
    authService: {
        login: jest.fn(),
    },
    loginSchema: {
        parse: jest.fn((data) => data),
    },
}));

describe('/api/auth/login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should login successfully', async () => {
        const mockResult = {
            user: { id: '1', email: 'test@example.com', role: 'STUDENT' },
            token: 'mock-token',
            expiresAt: new Date(),
        };

        (authService.login as jest.Mock).mockResolvedValue(mockResult);

        const request = new NextRequest('http://localhost:3000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.data.user).toBeDefined();
        expect(data.data.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
        (authService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

        const request = new NextRequest('http://localhost:3000/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'wrongpassword',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.success).toBe(false);
    });
});

