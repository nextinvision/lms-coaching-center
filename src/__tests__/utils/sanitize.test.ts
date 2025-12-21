// Sanitization Utilities Tests
import {
    sanitizeString,
    sanitizeFileName,
    sanitizeEmail,
    sanitizeUrl,
    sanitizeObject,
} from '@/core/utils/sanitize';

describe('Sanitization Utilities', () => {
    describe('sanitizeString', () => {
        it('should remove dangerous characters', () => {
            const input = '<script>alert("xss")</script>Hello';
            const result = sanitizeString(input);

            expect(result).not.toContain('<script>');
            expect(result).not.toContain('</script>');
        });

        it('should remove javascript: protocol', () => {
            const input = 'javascript:alert("xss")';
            const result = sanitizeString(input);

            expect(result).not.toContain('javascript:');
        });

        it('should limit string length', () => {
            const input = 'a'.repeat(20000);
            const result = sanitizeString(input);

            expect(result.length).toBeLessThanOrEqual(10000);
        });
    });

    describe('sanitizeFileName', () => {
        it('should replace invalid characters', () => {
            const input = 'file<>name.txt';
            const result = sanitizeFileName(input);

            expect(result).toBe('file__name.txt');
        });

        it('should remove leading dots', () => {
            const input = '...filename.txt';
            const result = sanitizeFileName(input);

            expect(result).not.toMatch(/^\.+/);
        });

        it('should limit file name length', () => {
            const input = 'a'.repeat(300);
            const result = sanitizeFileName(input);

            expect(result.length).toBeLessThanOrEqual(255);
        });
    });

    describe('sanitizeEmail', () => {
        it('should validate and sanitize valid email', () => {
            const input = '  TEST@EXAMPLE.COM  ';
            const result = sanitizeEmail(input);

            expect(result).toBe('test@example.com');
        });

        it('should return empty string for invalid email', () => {
            const input = 'not-an-email';
            const result = sanitizeEmail(input);

            expect(result).toBe('');
        });
    });

    describe('sanitizeUrl', () => {
        it('should allow http URLs', () => {
            const input = 'http://example.com';
            const result = sanitizeUrl(input);

            expect(result).toBe('http://example.com/');
        });

        it('should allow https URLs', () => {
            const input = 'https://example.com';
            const result = sanitizeUrl(input);

            expect(result).toBe('https://example.com/');
        });

        it('should reject javascript: URLs', () => {
            const input = 'javascript:alert("xss")';
            const result = sanitizeUrl(input);

            expect(result).toBe('');
        });
    });

    describe('sanitizeObject', () => {
        it('should sanitize nested objects', () => {
            const input = {
                name: '<script>alert("xss")</script>',
                nested: {
                    value: 'javascript:alert("xss")',
                },
            };

            const result = sanitizeObject(input);

            expect(result.name).not.toContain('<script>');
            expect(result.nested.value).not.toContain('javascript:');
        });
    });
});

