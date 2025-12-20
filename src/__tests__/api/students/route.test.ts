// Students API Route Tests
import { NextRequest, NextResponse } from 'next/server';
import { studentService } from '@/modules/students';
import { authService } from '@/modules/auth';
import { cookies } from 'next/headers';

jest.mock('@/modules/students', () => ({
    studentService: {
        getAll: jest.fn(),
        create: jest.fn(),
    },
    createStudentSchema: {
        parse: jest.fn((data) => data),
    },
}));

jest.mock('@/modules/auth', () => ({
    authService: {
        getCurrentUser: jest.fn(),
    },
}));

jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

// Import the actual route handlers
let GET: any;
let POST: any;

beforeAll(async () => {
    const routeModule = await import('@/app/api/students/route');
    GET = routeModule.GET;
    POST = routeModule.POST;
});

describe('/api/students', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({
            get: jest.fn(() => ({ value: 'mock-token' })),
        });
    });

    describe('GET', () => {
        it('should return students list for admin', async () => {
            const mockUser = { id: 'user-1', role: 'ADMIN' };
            const mockStudents = [
                { id: 'student-1', name: 'Student 1' },
                { id: 'student-2', name: 'Student 2' },
            ];

            (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (studentService.getAll as jest.Mock).mockResolvedValue(mockStudents);

            const request = new NextRequest('http://localhost:3000/api/students');
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data).toHaveLength(2);
        });

        it('should return 401 if not authenticated', async () => {
            (authService.getCurrentUser as jest.Mock).mockResolvedValue(null);

            const request = new NextRequest('http://localhost:3000/api/students');
            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.success).toBe(false);
        });
    });

    describe('POST', () => {
        it('should create student for admin', async () => {
            const mockUser = { id: 'user-1', role: 'ADMIN' };
            const mockStudent = { id: 'student-1', name: 'New Student' };

            (authService.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
            (studentService.create as jest.Mock).mockResolvedValue(mockStudent);

            const request = new NextRequest('http://localhost:3000/api/students', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'New Student',
                    email: 'new@test.com',
                    password: 'password123',
                }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data).toBeDefined();
        });
    });
});
