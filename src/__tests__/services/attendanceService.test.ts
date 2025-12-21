// Attendance Service Tests
import { attendanceService } from '@/modules/attendance/services/attendanceService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        attendance: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe('AttendanceService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('markAttendance', () => {
        it('should mark attendance successfully', async () => {
            const mockAttendance = {
                id: 'attendance-1',
                studentId: 'student-1',
                batchId: 'batch-1',
                date: new Date(),
                status: 'PRESENT',
            };

            (prisma.attendance.create as jest.Mock).mockResolvedValue(mockAttendance);
            (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await attendanceService.markAttendance({
                attendance: [
                    {
                        studentId: 'student-1',
                        status: 'PRESENT',
                    },
                ],
                batchId: 'batch-1',
                date: new Date().toISOString(),
            });

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('getAll', () => {
        it('should return attendance records', async () => {
            const mockAttendance = [
                { id: 'att-1', date: new Date(), status: 'PRESENT' },
                { id: 'att-2', date: new Date(), status: 'ABSENT' },
            ];

            (prisma.attendance.findMany as jest.Mock).mockResolvedValue(mockAttendance);

            const result = await attendanceService.getAll({ studentId: 'student-1' });

            expect(result).toHaveLength(2);
        });
    });
});

