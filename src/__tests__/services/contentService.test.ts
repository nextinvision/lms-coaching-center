// Content Service Tests
import { contentService } from '@/modules/content/services/contentService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        content: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('ContentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create content successfully', async () => {
            const mockContent = {
                id: 'content-1',
                title: 'Test Content',
                type: 'PDF',
                fileUrl: 'https://example.com/file.pdf',
            };

            (prisma.content.create as jest.Mock).mockResolvedValue(mockContent);

            const result = await contentService.create({
                title: 'Test Content',
                type: 'PDF',
                fileUrl: 'https://example.com/file.pdf',
                batchId: 'batch-1',
                subjectId: 'subject-1',
                chapterName: 'Chapter 1',
            });

            expect(result).toBeDefined();
            expect(result.title).toBe('Test Content');
        });
    });

    describe('getAll', () => {
        it('should return all content', async () => {
            const mockContent = [
                { id: 'content-1', title: 'Content 1' },
                { id: 'content-2', title: 'Content 2' },
            ];

            (prisma.content.findMany as jest.Mock).mockResolvedValue(mockContent);

            const result = await contentService.getAll();

            expect(result).toHaveLength(2);
        });
    });
});

