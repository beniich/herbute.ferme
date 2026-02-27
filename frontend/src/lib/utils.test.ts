import { describe, it, expect } from 'vitest';
import { cn, isValidEmail, getInitials } from './utils';

describe('Frontend utils', () => {
    describe('cn', () => {
        it('should merge tailwind classes correctly', () => {
            expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
            expect(cn('p-4', { 'm-2': true, 'm-4': false })).toBe('p-4 m-2');
        });
    });

    describe('isValidEmail', () => {
        it('should validate emails correctly', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('invalid-email')).toBe(false);
            expect(isValidEmail('test@example')).toBe(false);
        });
    });

    describe('getInitials', () => {
        it('should return initials correctly', () => {
            expect(getInitials('John Doe')).toBe('JD');
            expect(getInitials('Jane')).toBe('J');
        });
    });
});
