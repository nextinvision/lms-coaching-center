// Teachers Module Public API
export { useTeacher } from './hooks/useTeacher';
export { useTeachers } from './hooks/useTeachers';
export { teacherService } from './services/teacherService';
export { createTeacherSchema, updateTeacherSchema } from './services/teacherValidation';
export * from './components';
export type {
    Teacher,
    TeacherWithDetails,
    CreateTeacherInput,
    UpdateTeacherInput,
    TeacherFilters,
    TeacherStats,
} from './types/teacher.types';

