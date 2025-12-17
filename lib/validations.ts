import { z } from 'zod'

// Student validations
export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  batchId: z.string().optional(),
})

export const updateStudentSchema = createStudentSchema.partial()

// Batch validations
export const createBatchSchema = z.object({
  name: z.string().min(1, 'Batch name is required'),
  academicYearId: z.string().min(1, 'Academic year is required'),
})

export const updateBatchSchema = createBatchSchema.partial()

// Subject validations
export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  batchId: z.string().min(1, 'Batch is required'),
})

// Content validations
export const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  batchId: z.string().min(1, 'Batch is required'),
  subjectId: z.string().optional(),
  chapterName: z.string().optional(),
  language: z.enum(['EN', 'AS']).default('EN'),
})

// Attendance validations
export const markAttendanceSchema = z.object({
  batchId: z.string().min(1, 'Batch is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  students: z.array(
    z.object({
      studentId: z.string(),
      present: z.boolean(),
      remarks: z.string().optional(),
    })
  ),
})

// Test validations
export const createTestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['PRACTICE', 'WEEKLY', 'MONTHLY']),
  batchId: z.string().min(1, 'Batch is required'),
  subjectId: z.string().optional(),
  durationMinutes: z.number().positive().optional(),
  totalMarks: z.number().positive(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  questions: z.array(
    z.object({
      questionText: z.string().min(1, 'Question text is required'),
      questionTextAssamese: z.string().optional(),
      type: z.enum(['MCQ', 'SHORT_ANSWER']),
      options: z.record(z.string(), z.any()).optional(),
      correctAnswer: z.string().optional(),
      marks: z.number().positive().default(1),
      order: z.number().nonnegative(),
    })
  ),
})

// Assignment validations
export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  batchId: z.string().min(1, 'Batch is required'),
  subjectId: z.string().optional(),
  dueDate: z.string().optional(),
})

// Notice validations
export const createNoticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  contentAssamese: z.string().optional(),
  type: z.enum(['GENERAL', 'EXAM_DATE', 'HOLIDAY', 'IMPORTANT']).default('GENERAL'),
  batchId: z.string().optional(),
  priority: z.number().int().default(0),
  expiresAt: z.string().optional(),
})

