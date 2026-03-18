import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AutosaveIndicator } from '@/components/AutosaveIndicator';
import * as TaskContext from '@/context/TaskContext';

vi.mock('@/context/TaskContext', () => ({
    useTaskContext: vi.fn(),
}));

describe('AutosaveIndicator Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders syncing state correctly', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            autosaveStatus: 'syncing',
            autosaveError: null,
            isDirty: false,
            manualSave: vi.fn(),
        } as any);

        render(<AutosaveIndicator />);
        expect(screen.getByText('Syncing...')).toBeInTheDocument();
    });

    it('renders error state correctly', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            autosaveStatus: 'error',
            autosaveError: 'Failed to write DB',
            isDirty: true,
            manualSave: vi.fn(),
        } as any);

        render(<AutosaveIndicator />);
        // The container title should be the error message
        expect(screen.getByTitle('Failed to write DB')).toBeInTheDocument();
        expect(screen.getByText('Autosave Error')).toBeInTheDocument();
    });

    it('renders correctly when fallback error message is used', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            autosaveStatus: 'error',
            autosaveError: null,
            isDirty: true,
            manualSave: vi.fn(),
        } as any);

        render(<AutosaveIndicator />);
        expect(screen.getByTitle('Save failed')).toBeInTheDocument();
    });

    it('renders dirty state correctly', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            autosaveStatus: 'idle',
            autosaveError: null,
            isDirty: true,
            manualSave: vi.fn(),
        } as any);

        render(<AutosaveIndicator />);
        expect(screen.getByText('Autosave...')).toBeInTheDocument();
        expect(screen.getByTitle('Saving changes automatically...')).toBeInTheDocument();
    });

    it('renders synced state correctly', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            autosaveStatus: 'synced',
            autosaveError: null,
            isDirty: false,
            manualSave: vi.fn(),
        } as any);

        render(<AutosaveIndicator />);
        expect(screen.getByText('Synced')).toBeInTheDocument();
        expect(screen.getByTitle('All changes saved to project database')).toBeInTheDocument();
    });
});
