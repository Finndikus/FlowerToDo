import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsDialog } from '@/components/SettingsDialog';
import * as TaskContext from '@/context/TaskContext';

vi.mock('@/context/TaskContext', () => ({
    useTaskContext: vi.fn(),
}));

describe('SettingsDialog Component', () => {
    const mockLoadFromDatabase = vi.fn().mockResolvedValue(true);
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            loadFromDatabase: mockLoadFromDatabase,
        } as any);

        // Mock matchMedia and ResizeObserver standard for Radix UI test environments
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        global.ResizeObserver = class ResizeObserver {
            observe() { }
            unobserve() { }
            disconnect() { }
        };

        // Polyfill PointerEvent for Radix UI
        if (!global.PointerEvent) {
            class PointerEvent extends MouseEvent { }
            (global as any).PointerEvent = PointerEvent;
        }
    });

    it('renders correctly when open', () => {
        render(<SettingsDialog isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText('Storage Settings')).toBeInTheDocument();
        expect(screen.getByText('Overwrite current session with DB data')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<SettingsDialog isOpen={false} onClose={mockOnClose} />);

        expect(screen.queryByText('Storage Settings')).not.toBeInTheDocument();
    });

    it('calls loadFromDatabase and onClose when restore button is clicked', async () => {
        render(<SettingsDialog isOpen={true} onClose={mockOnClose} />);

        const restoreBtn = screen.getByRole('button', { name: /Overwrite current session with DB data/i });
        fireEvent.click(restoreBtn);

        expect(mockLoadFromDatabase).toHaveBeenCalledTimes(1);

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

});
