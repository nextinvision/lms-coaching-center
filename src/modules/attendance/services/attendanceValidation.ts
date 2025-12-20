// Attendance Validation Schemas
import { z } from 'zod';

export const markAttendanceSchema = z.object({
    batchId: z.string().min(1, 'Batch ID is required'),
    date: z.string().datetime(),
    attendance: z.array(
        z.object({
            studentId: z.string().min(1, 'Student ID is required'),
            present: z.boolean(),
            remarks: z.string().optional().nullable(),
        })
    ).min(1, 'At least one attendance record is required'),
});

export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;

