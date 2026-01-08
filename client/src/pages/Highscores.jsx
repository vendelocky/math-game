import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { MODES } from '../engine/MathGenerator';
import { ArrowLeftIcon } from '../components/Icons';

const Highscores = ({ onBack }) => {
    const [allScores, setAllScores] = useState([]);
    const [activeTab, setActiveTab] = useState(MODES.ADD);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadScores = async () => {
            try {
                // Try fetching from API
                const res = await fetch('http://localhost:3001/api/highscores');
                if (!res.ok) throw new Error('API unavailable');
                const data = await res.json();

                // Inject gameType
                const rounds = data.rounds.map(s => ({ ...s, gameType: 'rounds' }));
                const time = data.time.map(s => ({ ...s, gameType: 'time' }));

                setAllScores([...rounds, ...time]);
            } catch (err) {
                console.warn('Loading from local storage due to:', err.message);
                // Fallback to local storage
                try {
                    const localData = JSON.parse(localStorage.getItem('math-game-scores') || '[]');
                    setAllScores(localData);
                } catch (e) {
                    console.error('Error reading local storage', e);
                }
            } finally {
                setLoading(false);
            }
        };

        loadScores();
    }, []);

    // Helper to get top 5 scores for a specific game type and current mode
    const getTopScores = (gameType) => {
        return allScores
            .filter(s => s.mode === activeTab && s.gameType === gameType)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    };

    const ScoreTable = ({ title, data }) => (
        <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{title}</h3>
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-secondary)', borderBottom: '2px solid var(--color-secondary)', color: 'white' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left', width: '50px' }}>Rank</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>User</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Score</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#666' }}>#{i + 1}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{entry.name || 'NON'}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold', fontSize: '1.1rem' }}>{entry.score}</td>
                                <td style={{ padding: '0.75rem' }}>{entry.details}</td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: '#999' }}>No scores yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const tabs = [
        { id: MODES.ADD, label: 'ADD' },
        { id: MODES.SUB, label: 'SUB' },
        { id: MODES.MUL, label: 'MUL' },
        { id: MODES.DIV, label: 'DIV' },
        { id: MODES.ALL, label: 'ALL' },
    ];

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

            {/* Header */}
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', position: 'relative', top: '0.5rem', minHeight: '50px' }}>
                <div style={{ position: 'absolute', left: 0 }}>
                    <Button onClick={onBack} variant="secondary">
                        <ArrowLeftIcon size={30} />
                    </Button>
                </div>
            </div>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', color: 'var(--color-primary)' }}>Highscores</h1>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                width: '100%',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                justifyContent: 'flex-start' /* Allows scrolling on small screens if needed */
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '0.5rem 0.2rem',
                            minWidth: '60px',
                            background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-secondary)',
                            color: 'white',
                            border: `2px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-secondary)'}`,
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontSize: '0.9rem'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>Loading scores...</div>
            ) : (
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    width: '100%',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    <ScoreTable title="Rounds" data={getTopScores('rounds')} />
                    <ScoreTable title="Time Attack" data={getTopScores('time')} />
                </div>
            )}
        </div>
    );
};

export default Highscores;
