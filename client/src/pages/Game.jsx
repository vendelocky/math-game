import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Timer from '../components/Timer';
import Button from '../components/Button';
import { generateRound } from '../engine/MathGenerator';

const Game = ({ config, onEnd }) => {
    const [roundData, setRoundData] = useState(null);
    const [score, setScore] = useState(0);
    const [roundCount, setRoundCount] = useState(1);
    const [feedback, setFeedback] = useState(null); // { id, proper }
    const [isGameOver, setIsGameOver] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Game Loop Config
    const totalRounds = config.rounds || 10;
    const timeLimit = config.time || 60; // seconds

    const processSelection = (selectedId) => {
        if (feedback || showExitConfirm) return; // Ignore input during feedback or modal

        const isCorrect = selectedId === roundData.winnerId;

        setFeedback({ selectedId, isCorrect, correctId: roundData.winnerId });

        if (isCorrect) {
            setScore(prev => prev + 10);
            // Sound effect here
        } else {
            setScore(prev => prev - 5);
        }

        setTimeout(() => {
            setFeedback(null);
            nextRound();
        }, 1000);
    };

    const nextRound = () => {
        if (config.gameType === 'rounds' && roundCount >= totalRounds) {
            endGame();
            return;
        }

        // Scale difficulty
        const diff = Math.floor(score / 50) + 1;
        setRoundData(generateRound(config.mode, diff));
        setRoundCount(prev => prev + 1);
    };

    const endGame = () => {
        setIsGameOver(true);

        // Save Score
        const details = config.gameType === 'rounds' ? `${config.rounds} Rounds` : `${config.time} Seconds`;

        fetch('http://localhost:3001/api/highscores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gameType: config.gameType,
                score,
                mode: config.mode,
                details
            })
        }).catch(err => console.error('Failed to save score:', err));
    };

    const handleGiveUp = () => setShowExitConfirm(true);
    const cancelGiveUp = () => setShowExitConfirm(false);
    const confirmGiveUp = () => {
        // Just return to menu, do NOT save score (bypass endGame logic)
        onEnd();
    };

    useEffect(() => {
        // Initial Round
        setRoundData(generateRound(config.mode, 1));
    }, []);

    if (isGameOver) {
        return (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '2rem' }}>
                <h1>Game Over!</h1>
                <h2>Score: {score}</h2>
                <Button onClick={onEnd} variant="primary">Main Menu</Button>
            </div>
        );
    }

    if (!roundData) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', position: 'relative' }}>

            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {config.gameType === 'rounds'
                    ? <span>Round: {roundCount}/{totalRounds}</span>
                    : <Timer duration={timeLimit} onTimeUp={endGame} active={!isGameOver && !showExitConfirm} />
                }
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Which is BIGGER?</h2>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-md)',
                width: '100%'
            }}>
                {roundData.options.map((opt) => {
                    let state = 'default';
                    if (feedback) {
                        if (opt.id === feedback.correctId) state = 'correct';
                        else if (opt.id === feedback.selectedId && !feedback.isCorrect) state = 'wrong';
                        else state = 'dim';
                    }

                    return (
                        <Card
                            key={opt.id}
                            text={opt.text}
                            state={state}
                            onClick={() => processSelection(opt.id)}
                            disabled={!!feedback || showExitConfirm}
                        />
                    );
                })}
            </div>
            <div style={{ marginTop: '2rem' }}>
                <h2>Score: {score}</h2>
            </div>
            {/* Give Up Button */}
            <div style={{ marginTop: '2rem' }}>
                <Button
                    onClick={handleGiveUp}
                    style={{
                        background: 'transparent',
                        border: '1px solid #ff4d4d',
                        color: '#ff4d4d',
                        opacity: 0.8
                    }}
                >
                    Exit
                </Button>
            </div>

            {/* Confirmation Modal */}
            {showExitConfirm && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Are you giving up?</h3>
                    <p style={{ color: '#ccc', marginBottom: '2rem' }}>Your highscore will NOT be saved.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button
                            onClick={confirmGiveUp}
                            style={{ backgroundColor: '#ff4d4d', color: 'white' }}
                        >
                            Give Up
                        </Button>
                        <Button
                            onClick={cancelGiveUp}
                            variant="secondary"
                        >
                            No way
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Game;
