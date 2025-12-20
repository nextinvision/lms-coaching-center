// Academic Years Module Public API
export { useAcademicYear } from './hooks/useAcademicYear';
export { useAcademicYears } from './hooks/useAcademicYears';
export { useActiveAcademicYear } from './hooks/useActiveAcademicYear';
export { academicYearService } from './services/academic-yearService';
export { createAcademicYearSchema, updateAcademicYearSchema } from './services/academic-yearValidation';
export * from './components';
export type {
    AcademicYear,
    CreateAcademicYearInput,
    UpdateAcademicYearInput,
    AcademicYearFilters,
    AcademicYearStats,
} from './types/academic-year.types';

