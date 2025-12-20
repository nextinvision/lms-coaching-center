// Subjects Module Public API
export { useSubject } from './hooks/useSubject';
export { useSubjects } from './hooks/useSubjects';
export { subjectService } from './services/subjectService';
export { createSubjectSchema, updateSubjectSchema } from './services/subjectValidation';
export * from './components';
export type {
    Subject,
    CreateSubjectInput,
    UpdateSubjectInput,
    SubjectFilters,
} from './types/subject.types';

