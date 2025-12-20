// Test Validation Schemas
import { z } from 'zod';

export const createTestSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['PRACTICE', 'WEEKLY', 'MONTHLY']),
    batchId: z.string().min(1, 'Batch ID is required'),
    subjectId: z.string().optional().nullable(),
    durationMinutes: z.number().positive().optional().nullable(),
    totalMarks: z.number().positive('Total marks must be positive'),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
});

export const createQuestionSchema = z.object({
    questionText: z.string().min(1, 'Question text is required'),
    questionTextAssamese: z.string().optional().nullable(),
    type: z.enum(['MCQ', 'SHORT_ANSWER']),
    options: z
        .object({
            A: z.string(),
            B: z.string(),
            C: z.string(),
            D: z.string(),
            correct: z.enum(['A', 'B', 'C', 'D']),
        })
        .optional()
        .nullable(),
    correctAnswer: z.string().optional().nullable(),
    marks: z.number().positive('Marks must be positive'),
    order: z.number().int().min(0),
});

export const updateTestSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.enum(['PRACTICE', 'WEEKLY', 'MONTHLY']).optional(),
    durationMinutes: z.number().positive().optional().nullable(),
    totalMarks: z.number().positive().optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    isActive: z.boolean().optional(),
});

export const submitTestSchema = z.object({
    answers: z.array(
        z.object({
            questionId: z.string(),
            answerText: z.string().optional().nullable(),
            selectedOption: z.string().optional().nullable(),
        })
    ),
    timeSpent: z.number().int().min(0),
});

export type CreateTestInput = z.infer<typeof createTestSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateTestInput = z.infer<typeof updateTestSchema>;
export type SubmitTestInput = z.infer<typeof submitTestSchema>;

