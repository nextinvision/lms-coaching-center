// Legacy utils - re-exporting from shared utils for backward compatibility
// New code should import from '@/shared/utils/*' directly
export { cn } from '@/shared/utils/cn'
export { formatUtils } from '@/shared/utils/format'
export { dateUtils } from '@/shared/utils/date'
export { helpers } from '@/shared/utils/helpers'

// Legacy function wrappers for backward compatibility
import { dateUtils } from '@/shared/utils/date'
import { formatUtils } from '@/shared/utils/format'

export function formatDate(date: Date | string): string {
  return dateUtils.format(date, 'MMMM d, yyyy')
}

export function formatDateTime(date: Date | string): string {
  return dateUtils.formatDateTime(date)
}

export function calculateAttendancePercentage(
  presentDays: number,
  totalDays: number
): number {
  if (totalDays === 0) return 0
  return Math.round((presentDays / totalDays) * 100)
}

export function formatFileSize(bytes: number): string {
  return formatUtils.fileSize(bytes)
}

