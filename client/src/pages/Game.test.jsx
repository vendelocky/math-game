import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Game from './Game';
import { MODES } from '../engine/MathGenerator';

// Mock the MathGenerator
vi.mock('../engine/MathGenerator', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        generateRound: vi.fn(),
    };
});

import { generateRound } from '../engine/MathGenerator';

describe('Game Component', () => {
    // Basic config for tests
    const mockConfig = {
        mode: MODES.ADD,
        gameType: 'rounds',
        rounds: 5,
        time: 60
    };
    const mockOnEnd = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();

        // Default Mock Return
        generateRound.mockReturnValue({
            options: [
                { id: '1', text: '5', val: 5 },
                { id: '2', text: '10', val: 10 }, // Winner
                { id: '3', text: '3', val: 3 },
                { id: '4', text: '1', val: 1 }
            ],
            winnerId: '2'
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Exit Confirmation', () => {
        it('shows confirmation modal when Exit is clicked', () => {
            render(<Game config={mockConfig} onEnd={mockOnEnd} />);

            fireEvent.click(screen.getByText('Exit'));

            expect(screen.getByText('Are you giving up?')).toBeInTheDocument();
            expect(screen.getByText('Your score will NOT be saved.')).toBeInTheDocument();
        });

        it('hides modal when "No way" is clicked', () => {
            render(<Game config={mockConfig} onEnd={mockOnEnd} />);

            fireEvent.click(screen.getByText('Exit'));
            expect(screen.getByText('Are you giving up?')).toBeInTheDocument();

            fireEvent.click(screen.getByText('No way'));
            expect(screen.queryByText('Are you giving up?')).not.toBeInTheDocument();
        });

        it('calls onEnd when "Give Up" is clicked', () => {
            render(<Game config={mockConfig} onEnd={mockOnEnd} />);

            fireEvent.click(screen.getByText('Exit'));
            fireEvent.click(screen.getByText('Give Up'));

            expect(mockOnEnd).toHaveBeenCalled();
        });
    });

    describe('Full Game Flow', () => {
        it('plays through rounds, enters game over, and submits score', async () => {
            // Mock fetch for score submission
            global.fetch = vi.fn(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({})
            }));

            // Config for 2 rounds only
            const shortGameConfig = { ...mockConfig, rounds: 2 };

            render(<Game config={shortGameConfig} onEnd={mockOnEnd} />);

            // --- ROUND 1 ---
            expect(screen.getByText('Round: 1/2')).toBeInTheDocument();
            // Click winner (id: 2, text: '10')
            fireEvent.click(screen.getByText('10'));

            // Advance timers to handle setTimeout in processSelection
            act(() => {
                vi.advanceTimersByTime(1000);
            });

            // --- ROUND 2 ---
            expect(screen.getByText('Round: 2/2')).toBeInTheDocument();
            // Click winner again
            fireEvent.click(screen.getByText('10'));

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            // --- GAME OVER ---
            expect(screen.getByText('Game Over!')).toBeInTheDocument();

            // Enter Name
            const input = screen.getByRole('textbox');
            fireEvent.change(input, { target: { value: 'ABC' } });

            // Submit
            fireEvent.click(screen.getByText('Submit'));

            // Verify backend call
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/highscores'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"name":"ABC"')
                })
            );

            // Wait for promise resolution in submitScore
            await waitFor(() => {
                expect(mockOnEnd).toHaveBeenCalled();
            });
        });

        it('can skip saving score at game over', () => {
            const shortGameConfig = { ...mockConfig, rounds: 1 };
            render(<Game config={shortGameConfig} onEnd={mockOnEnd} />);

            // Finish Round 1
            fireEvent.click(screen.getByText('10'));
            act(() => {
                vi.advanceTimersByTime(1000);
            });

            // See Game Over
            expect(screen.getByText('Game Over!')).toBeInTheDocument();

            // Click Skip
            fireEvent.click(screen.getByText('Skip'));

            expect(mockOnEnd).toHaveBeenCalled();
        });
    });
});
