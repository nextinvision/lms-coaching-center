// Students Module Public API
export { useStudent } from './hooks/useStudent';
export { useStudents } from './hooks/useStudents';
export { useStudentStats } from './hooks/useStudentStats';
export { studentService } from './services/studentService';
export { createStudentSchema, updateStudentSchema } from './services/studentValidation';
export * from './components';
export type {
    Student,
    StudentWithStats,
    CreateStudentInput,
    UpdateStudentInput,
    StudentFilters,
    StudentStats as StudentStatsType,
} from './types/student.types';

