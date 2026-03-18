import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs/promises';
import { ensureDb, readDb, writeDb } from '@/lib/storage';

// Mock the fs module
vi.mock('fs/promises', () => ({
    default: {
        mkdir: vi.fn(),
        access: vi.fn(),
        writeFile: vi.fn(),
        readFile: vi.fn(),
        rename: vi.fn(),
    },
}));

describe('storage.ts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('ensureDb', () => {
        it('creates directory and file if they do not exist', async () => {
            (fs.access as any).mockRejectedValueOnce(new Error('File not found'));

            await ensureDb();

            expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify([], null, 2),
                'utf-8'
            );
        });

        it('does not create file if it already exists', async () => {
            (fs.access as any).mockResolvedValueOnce(undefined);

            await ensureDb();

            expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
            expect(fs.writeFile).not.toHaveBeenCalled();
        });

        it('throws error if mkdir fails', async () => {
            const dbError = new Error('Permission denied');
            (fs.mkdir as any).mockRejectedValueOnce(dbError);

            await expect(ensureDb()).rejects.toThrow('Permission denied');
        });
    });

    describe('readDb', () => {
        it('reads and parses the json file', async () => {
            const mockData = [{ id: '1', name: 'Task 1' }];
            (fs.access as any).mockResolvedValueOnce(undefined); // ensureDb passes
            (fs.readFile as any).mockResolvedValueOnce(JSON.stringify(mockData));

            const result = await readDb();

            expect(fs.readFile).toHaveBeenCalledWith(expect.any(String), 'utf-8');
            expect(result).toEqual(mockData);
        });
    });

    describe('writeDb', () => {
        it('writes data to tmp file and renames it', async () => {
            const data = [{ id: '2', name: 'Task 2' }];
            (fs.access as any).mockResolvedValueOnce(undefined); // ensureDb passes

            await writeDb(data);

            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining('.tmp'),
                JSON.stringify(data, null, 2),
                'utf-8'
            );

            expect(fs.rename).toHaveBeenCalledWith(
                expect.stringContaining('.tmp'),
                expect.not.stringContaining('.tmp')
            );
        });
    });
});
