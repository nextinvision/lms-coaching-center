// Reports Types
export interface AttendanceReportFilters {
    batchId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
}

export interface AttendanceReportData {
    studentId: string;
    studentName: string;
    batchName: string;
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
}

export interface BatchAttendanceReport {
    batchId: string;
    batchName: string;
    totalStudents: number;
    averageAttendance: number;
    students: AttendanceReportData[];
}

export interface PerformanceReportFilters {
    batchId?: string;
    subjectId?: string;
    testId?: string;
    startDate?: string;
    endDate?: string;
}

export interface StudentPerformanceData {
    studentId: string;
    studentName: string;
    batchName: string;
    totalTests: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    subjectPerformance: Array<{
        subjectId: string;
        subjectName: string;
        averageMarks: number;
        testsCount: number;
    }>;
}

export interface BatchPerformanceReport {
    batchId: string;
    batchName: string;
    totalStudents: number;
    averagePerformance: number;
    students: StudentPerformanceData[];
}

export interface ReportStats {
    totalStudents: number;
    totalBatches: number;
    totalTests: number;
    averageAttendance: number;
    averagePerformance: number;
}

export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV';

