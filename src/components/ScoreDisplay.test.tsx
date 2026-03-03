import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import * as TaskContext from '@/context/TaskContext';

// Mock the hook
vi.mock('@/context/TaskContext', () => ({
    useTaskContext: vi.fn(),
}));

describe('ScoreDisplay Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders the current score correctly', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            totalScore: 42,
        } as any);

        render(<ScoreDisplay />);

        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('animates score on change', () => {
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            totalScore: 10,
        } as any);

        const { rerender, container } = render(<ScoreDisplay />);

        // The div containing the score should have text-primary class when animating
        const scoreSpan = screen.getByText('10');
        expect(scoreSpan).toHaveClass('text-primary');

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(scoreSpan).not.toHaveClass('text-primary');

        // Change score to trigger useEffect again
        vi.spyOn(TaskContext, 'useTaskContext').mockReturnValue({
            totalScore: 20,
        } as any);

        rerender(<ScoreDisplay />);
        const newScoreSpan = screen.getByText('20');
        expect(newScoreSpan).toHaveClass('text-primary');
    });
});
