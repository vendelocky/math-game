import React, { useState } from 'react';
import Button from '../components/Button';
import { MODES } from '../engine/MathGenerator';
import { ArrowLeftIcon } from '../components/Icons';

const Home = ({ onStart, onShowHighscores }) => {
    const [step, setStep] = useState(1);
    const [mode, setMode] = useState(MODES.ADD);
    const [gameType, setGameType] = useState('rounds'); // 'rounds' or 'time'
    const [roundCount, setRoundCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(60);

    const handleStart = () => {
        onStart({
            mode,
            gameType,
            rounds: parseInt(roundCount, 10),
            time: parseInt(timeLimit, 10)
        });
    };

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
    };

    return (
        <div className="flex-center" style={{ flexDirection: 'column', width: '100%', height: '100%', position: 'relative', padding: '1rem' }}>

            {/* Step 1: Mode Selection */}
            {step === 1 && (
                <>
                    <div style={{ position: 'absolute', top: '0.1rem', right: '1rem', zIndex: 10 }}>
                        <Button
                            onClick={onShowHighscores}
                            variant="secondary"
                            title="Highscores"
                        >
                            🏆
                        </Button>
                    </div>

                    <div className="text-center" style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                            WHICH IS BIGGER?
                        </h1>
                        <p style={{ fontSize: 'var(--font-size-md)', opacity: 0.8 }}>Choose math mode!</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '350px' }}>
                        {[MODES.ADD, MODES.SUB, MODES.MUL, MODES.DIV, MODES.ALL].map((m) => {
                            const signs = {
                                [MODES.ADD]: '+',
                                [MODES.SUB]: '-',
                                [MODES.MUL]: '×',
                                [MODES.DIV]: '÷',
                                [MODES.ALL]: '+-×÷'
                            };
                            return (
                                <Button
                                    key={m}
                                    variant={mode === m ? 'primary' : 'secondary'}
                                    onClick={() => handleModeSelect(m)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '1.5rem',
                                        fontSize: '1.2rem',
                                        aspectRatio: '1',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: mode === m ? '2px solid white' : '2px solid transparent'
                                    }}
                                >
                                    <div style={{ fontSize: '2rem', lineHeight: '1', marginBottom: '0.5rem' }}>{signs[m]}</div>
                                    <span style={{ fontSize: '1rem' }}>{m.toUpperCase()}</span>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Next Button - Bottom Right */}
                    <div style={{ display: 'flex', marginTop: '3rem' }}>
                        <Button
                            variant="primary"
                            onClick={() => setStep(2)}
                            style={{
                                borderRadius: '50%',
                                width: '60px',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                paddingBottom: '0.5rem',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                            }}
                        >
                            NEXT
                        </Button>
                    </div>
                </>
            )}

            {/* Step 2: Game Configuration */}
            {step === 2 && (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', maxWidth: '400px' }}>

                        {/* Back Button - Top Left */}
                        <div style={{ position: 'absolute', top: '0.5rem', left: '1rem' }}>
                            <Button
                                onClick={() => setStep(1)}
                                variant="secondary"
                                style={{
                                    padding: '0.5rem',
                                    fontSize: '2rem',
                                    lineHeight: '1',
                                    background: 'transparent',
                                    border: 'none'
                                }}
                                title="Back"
                            >
                                <ArrowLeftIcon size={30} />
                            </Button>
                        </div>

                        <div className="text-center" style={{ marginTop: '4rem', marginBottom: '1rem', flex: '0 0 auto' }}>
                            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                                Mode: {mode.toUpperCase()}
                            </h2>
                            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Configure your game</p>
                        </div>

                        <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <Button
                                    variant={gameType === 'rounds' ? 'primary' : 'secondary'}
                                    onClick={() => setGameType('rounds')}
                                    style={{ flex: 1 }}
                                >
                                    Rounds
                                </Button>
                                <Button
                                    variant={gameType === 'time' ? 'primary' : 'secondary'}
                                    onClick={() => setGameType('time')}
                                    style={{ flex: 1 }}
                                >
                                    Time Attack
                                </Button>
                            </div>

                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                {gameType === 'rounds' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Number of Rounds</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="1000"
                                            value={roundCount}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val > 1000) setRoundCount(1000);
                                                else setRoundCount(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur();
                                                }
                                            }}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                border: '2px solid var(--color-primary)',
                                                width: '100%',
                                                textAlign: 'center',
                                                fontSize: '1.5rem',
                                                background: '#333',
                                                color: 'white'
                                            }}
                                        />
                                        <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>Max: 1000</span>
                                    </div>
                                )}

                                {gameType === 'time' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                                        <label style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Time Limit (Seconds)</label>
                                        <input
                                            type="number"
                                            min="10"
                                            max="3600"
                                            value={timeLimit}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val > 3600) setTimeLimit(3600);
                                                else setTimeLimit(e.target.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur();
                                                }
                                            }}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                border: '2px solid var(--color-primary)',
                                                width: '100%',
                                                textAlign: 'center',
                                                fontSize: '1.5rem',
                                                background: '#333',
                                                color: 'white'
                                            }}
                                        />
                                        <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>Max: 3600</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '-8rem', width: '100%' }}>
                        <Button
                            variant="primary"
                            onClick={handleStart}
                        >
                            PLAY!
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
