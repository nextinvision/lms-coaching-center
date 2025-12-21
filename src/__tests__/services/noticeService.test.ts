// Notice Service Tests
import { noticeService } from '@/modules/notices/services/noticeService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        notice: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('NoticeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create notice successfully', async () => {
            const mockNotice = {
                id: 'notice-1',
                title: 'Important Notice',
                content: 'School closed tomorrow',
                type: 'IMPORTANT',
            };

            (prisma.notice.create as jest.Mock).mockResolvedValue(mockNotice);

            const result = await noticeService.create({
                title: 'Important Notice',
                content: 'School closed tomorrow',
                type: 'IMPORTANT' as any,
            });

            expect(result).toBeDefined();
            expect(result.title).toBe('Important Notice');
        });
    });

    describe('getAll', () => {
        it('should return all notices', async () => {
            const mockNotices = [
                { id: 'notice-1', title: 'Notice 1' },
                { id: 'notice-2', title: 'Notice 2' },
            ];

            (prisma.notice.findMany as jest.Mock).mockResolvedValue(mockNotices);

            const result = await noticeService.getAll();

            expect(result).toHaveLength(2);
        });
    });
});

