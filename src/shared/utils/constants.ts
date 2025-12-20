// Application Constants
export const APP_NAME = 'LMS Coaching Center';
export const APP_DESCRIPTION = 'Learning Management System for Coaching Centers';
export const APP_VERSION = '1.0.0';

// File Upload Limits
export const MAX_FILE_SIZE = {
    PDF: 10 * 1024 * 1024, // 10MB
    IMAGE: 5 * 1024 * 1024, // 5MB
    VIDEO: 0, // YouTube only, no direct upload
};

export const ALLOWED_FILE_TYPES = {
    PDF: ['application/pdf'],
    IMAGE: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'PPP'; // Jan 1, 2024
export const DATE_TIME_FORMAT = 'PPP p'; // Jan 1, 2024 at 3:00 PM
export const TIME_FORMAT = 'p'; // 3:00 PM
export const INPUT_DATE_FORMAT = 'yyyy-MM-dd';

// Session
export const SESSION_DURATION_DAYS = 7;

// Test
export const DEFAULT_TEST_DURATION = 60; // minutes
export const AUTO_SUBMIT_BUFFER = 5; // seconds before auto-submit

// Attendance
export const ATTENDANCE_PERCENTAGE_THRESHOLD = 75; // minimum required

// Roles
export const ROLES = {
    STUDENT: 'STUDENT',
    TEACHER: 'TEACHER',
    ADMIN: 'ADMIN',
} as const;

// Languages
export const LANGUAGES = {
    EN: 'en',
    AS: 'as',
} as const;

// Content Types
export const CONTENT_TYPES = {
    PDF: 'PDF',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
} as const;

// Test Types
export const TEST_TYPES = {
    PRACTICE: 'PRACTICE',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
} as const;

// Question Types
export const QUESTION_TYPES = {
    MCQ: 'MCQ',
    SHORT_ANSWER: 'SHORT_ANSWER',
} as const;

// Notice Types
export const NOTICE_TYPES = {
    GENERAL: 'GENERAL',
    EXAM_DATE: 'EXAM_DATE',
    HOLIDAY: 'HOLIDAY',
    IMPORTANT: 'IMPORTANT',
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
    LOW: 0,
    NORMAL: 1,
    HIGH: 2,
    URGENT: 3,
} as const;

// Status
export const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    COMPLETED: 'completed',
    SUBMITTED: 'submitted',
    CHECKED: 'checked',
} as const;

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    STUDENT_DASHBOARD: '/student/dashboard',
    TEACHER_DASHBOARD: '/teacher/dashboard',
    ADMIN_DASHBOARD: '/admin/dashboard',
} as const;

export default {
    APP_NAME,
    APP_DESCRIPTION,
    APP_VERSION,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES,
    DEFAULT_PAGE_SIZE,
    PAGE_SIZE_OPTIONS,
    DATE_FORMAT,
    DATE_TIME_FORMAT,
    TIME_FORMAT,
    INPUT_DATE_FORMAT,
    SESSION_DURATION_DAYS,
    DEFAULT_TEST_DURATION,
    AUTO_SUBMIT_BUFFER,
    ATTENDANCE_PERCENTAGE_THRESHOLD,
    ROLES,
    LANGUAGES,
    CONTENT_TYPES,
    TEST_TYPES,
    QUESTION_TYPES,
    NOTICE_TYPES,
    PRIORITY_LEVELS,
    STATUS,
    ROUTES,
};
