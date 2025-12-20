// Test Types
import type {
    Test as PrismaTest,
    Question as PrismaQuestion,
    TestSubmission as PrismaTestSubmission,
    Answer as PrismaAnswer,
    Batch,
    Subject,
    Student,
} from '@prisma/client';

export type TestType = 'PRACTICE' | 'WEEKLY' | 'MONTHLY';
export type QuestionType = 'MCQ' | 'SHORT_ANSWER';

export interface Question extends Omit<PrismaQuestion, 'test'> {
    test?: PrismaTest;
}

export interface MCQOptions {
    A: string;
    B: string;
    C: string;
    D: string;
    correct: 'A' | 'B' | 'C' | 'D';
}

export interface Answer extends Omit<PrismaAnswer, 'question'> {
    question?: Question;
}

export interface TestSubmission extends PrismaTestSubmission {
    test: PrismaTest;
    student: Student;
    answers: Answer[];
}

export interface Test extends PrismaTest {
    batch: Batch;
    subject?: Subject | null;
    questions: Question[];
    submissions?: TestSubmission[];
}

export interface CreateTestInput {
    title: string;
    description?: string;
    type: TestType;
    batchId: string;
    subjectId?: string | null;
    durationMinutes?: number | null;
    totalMarks: number;
    startDate?: Date | null;
    endDate?: Date | null;
}

export interface CreateQuestionInput {
    questionText: string;
    questionTextAssamese?: string | null;
    type: QuestionType;
    options?: MCQOptions | null;
    correctAnswer?: string | null;
    marks: number;
    order: number;
}

export interface UpdateTestInput {
    title?: string;
    description?: string;
    type?: TestType;
    durationMinutes?: number | null;
    totalMarks?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    isActive?: boolean;
}

export interface SubmitTestInput {
    answers: Array<{
        questionId: string;
        answerText?: string | null;
        selectedOption?: string | null;
    }>;
    timeSpent: number;
}

export interface TestFilters {
    batchId?: string;
    subjectId?: string;
    type?: TestType;
    isActive?: boolean;
    search?: string;
}

export interface TestStats {
    totalTests: number;
    activeTests: number;
    completedTests: number;
    averageScore: number;
}

