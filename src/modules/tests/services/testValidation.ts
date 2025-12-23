// Test Validation Schemas
import { z } from 'zod';

// Custom datetime schema that accepts datetime-local input format
// datetime-local returns "YYYY-MM-DDTHH:mm" but Zod expects full ISO format
const optionalDatetimeSchema = z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
        // Handle empty string, null, or undefined
        if (!val || val === '') return null;

        // If it's already a full ISO string, return as is
        if (val.includes('Z') || val.includes('+') || val.includes('T') && val.split('T')[1].includes(':') && val.split('T')[1].split(':').length >= 3) {
            return val;
        }

        // Transform datetime-local format (YYYY-MM-DDTHH:mm) to ISO format
        // Add seconds if missing
        const hasSeconds = val.split('T')[1]?.split(':').length >= 3;
        const isoString = hasSeconds ? `${val}:00` : `${val}:00`;

        // Validate it's a valid date
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }

        return isoString;
    })
    .refine((val) => {
        if (!val) return true; // null is valid for optional fields
        const date = new Date(val);
        return !isNaN(date.getTime());
    }, 'Invalid datetime');

export const createTestSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    type: z.enum(['PRACTICE', 'WEEKLY', 'MONTHLY']),
    batchId: z.string().min(1, 'Batch ID is required'),
    subjectId: z.string().optional().nullable(),
    durationMinutes: z.number().positive().optional().nullable(),
    totalMarks: z.number().positive('Total marks must be positive'),
    startDate: optionalDatetimeSchema,
    endDate: optionalDatetimeSchema,
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
    startDate: optionalDatetimeSchema,
    endDate: optionalDatetimeSchema,
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

