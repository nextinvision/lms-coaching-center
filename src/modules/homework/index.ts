// Homework Module Public API
export { useHomework } from './hooks/useHomework';
export { useHomeworks } from './hooks/useHomeworks';
export { useHomeworkByBatch } from './hooks/useHomeworkByBatch';
export { useSubmission } from './hooks/useSubmission';
export { homeworkService } from './services/homeworkService';
export { submissionService } from './services/submissionService';
export { createAssignmentSchema, updateAssignmentSchema, submitAssignmentSchema, checkSubmissionSchema } from './services/homeworkValidation';
export * from './components';
export type {
    Assignment,
    AssignmentSubmission,
    AssignmentWithDetails,
    CreateAssignmentInput,
    UpdateAssignmentInput,
    SubmitAssignmentInput,
    CheckSubmissionInput,
    AssignmentFilters,
    AssignmentStats,
} from './types/homework.types';

