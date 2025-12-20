// Batch Service Tests
import { batchService } from '@/modules/batches/services/batchService';
import prisma from '@/core/database/prisma';

jest.mock('@/core/database/prisma', () => ({
    __esModule: true,
    default: {
        batch: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

describe('BatchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new batch', async () => {
            const mockBatch = {
                id: 'batch-1',
                name: 'Class 10',
                academicYearId: 'year-1',
            };

            (prisma.batch.create as jest.Mock).mockResolvedValue(mockBatch);

            const result = await batchService.create({
                name: 'Class 10',
                academicYearId: 'year-1',
            });

            expect(result).toBeDefined();
            expect(result.name).toBe('Class 10');
            expect(prisma.batch.create).toHaveBeenCalled();
        });
    });

    describe('getAll', () => {
        it('should return all batches', async () => {
            const mockBatches = [
                { id: 'batch-1', name: 'Class 10' },
                { id: 'batch-2', name: 'Class 11' },
            ];

            (prisma.batch.findMany as jest.Mock).mockResolvedValue(mockBatches);

            const result = await batchService.getAll();

            expect(result).toHaveLength(2);
            expect(prisma.batch.findMany).toHaveBeenCalled();
        });
    });
});

