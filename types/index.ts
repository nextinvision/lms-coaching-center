import { UserRole, Language, ContentType, TestType, QuestionType, NoticeType } from '@prisma/client'

export type { UserRole, Language, ContentType, TestType, QuestionType, NoticeType }

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

