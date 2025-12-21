// Notices Module Public API
export { useNotice } from './hooks/useNotice';
export { useNotices } from './hooks/useNotices';
export { noticeService } from './services/noticeService';
export { createNoticeSchema, updateNoticeSchema } from './services/noticeValidation';
export * from './components';
export type {
    Notice,
    NoticeType,
    CreateNoticeInput,
    UpdateNoticeInput,
    NoticeFilters,
    NoticeStats,
} from './types/notice.types';

