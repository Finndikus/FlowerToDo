import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
    describe('cn', () => {
        it('merges tailwind classes correctly', () => {
            // Basic merge
            expect(cn('w-4 h-4', 'text-red-500')).toBe('w-4 h-4 text-red-500');

            // Merge with conflicting classes (twMerge should resolve it)
            expect(cn('p-4 p-8')).toBe('p-8');

            // Merge with conditionals (clsx functionality)
            expect(cn('w-4', true && 'h-4', false && 'text-red-500')).toBe('w-4 h-4');

            // Arrays and objects
            expect(cn('w-4', { 'h-4': true, 'text-red-500': false })).toBe('w-4 h-4');
        });
    });
});
