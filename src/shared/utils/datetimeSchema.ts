// Shared Datetime Schema for Zod Validation
// Handles both ISO datetime strings and datetime-local format (YYYY-MM-DDTHH:mm)
import { z } from 'zod';

/**
 * Custom datetime validation schema that accepts:
 * - ISO datetime strings (e.g., "2024-01-01T12:00:00Z")
 * - datetime-local format (e.g., "2024-01-01T12:00")
 * 
 * Automatically converts datetime-local format to ISO format
 */
export const flexibleDatetimeSchema = z
    .string()
    .optional()
    .nullable()
    .refine(
        (val) => {
            if (!val || val.trim() === '') return true; // Allow empty/null
            
            // Check if it's a valid ISO datetime string
            if (z.string().datetime().safeParse(val).success) {
                return true;
            }
            
            // Check if it's datetime-local format (YYYY-MM-DDTHH:mm)
            const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
            if (datetimeLocalRegex.test(val)) {
                const date = new Date(val);
                return !isNaN(date.getTime());
            }
            
            return false;
        },
        {
            message: 'Invalid datetime format. Expected ISO datetime or datetime-local format (YYYY-MM-DDTHH:mm)',
        }
    )
    .transform((val) => {
        if (!val || val.trim() === '') return null;
        
        // If already valid ISO datetime, return as is
        if (z.string().datetime().safeParse(val).success) {
            return val;
        }
        
        // Convert datetime-local to ISO
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (datetimeLocalRegex.test(val)) {
            const date = new Date(val);
            if (!isNaN(date.getTime())) {
                return date.toISOString();
            }
        }
        
        return val;
    });

