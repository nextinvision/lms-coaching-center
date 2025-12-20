// Attendance Module Public API
export { useAttendance } from './hooks/useAttendance';
export { useAttendanceStats } from './hooks/useAttendanceStats';
export { attendanceService } from './services/attendanceService';
export { markAttendanceSchema } from './services/attendanceValidation';
export * from './components';
export type {
    Attendance,
    MarkAttendanceInput,
    AttendanceFilters,
    AttendanceStats,
    BatchAttendanceSummary,
} from './types/attendance.types';

