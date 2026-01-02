import React, { useEffect, useState } from 'react';
import Button from '../components/Button';

const Highscores = ({ onBack }) => {
    const [scores, setScores] = useState({ rounds: [], time: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/highscores')
            .then(res => res.json())
            .then(data => {
                setScores(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch highscores:', err);
                setLoading(false);
            });
    }, []);

    const ScoreTable = ({ title, data }) => (
        <div style={{ flex: 1, minWidth: '300px' }}>
            <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '1rem' }}>{title}</h3>
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Rank</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Score</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Mode</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Details</th>
                            {/* <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem' }}>#{i + 1}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{entry.score}</td>
                                <td style={{ padding: '0.75rem' }}>{entry.mode.toUpperCase()}</td>
                                <td style={{ padding: '0.75rem' }}>{entry.details}</td>
                                {/* <td style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(entry.date).toLocaleDateString()}
                                </td> */}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#999' }}>No scores yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                <Button onClick={onBack} variant="secondary">🡄</Button>
                {/* <h1 style={{ margin: 0 }}>Highscores</h1> */}
            </div>

            {loading ? (
                <div>Loading scores...</div>
            ) : (
                <div style={{ display: 'flex', gap: '2rem', width: '100%', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <ScoreTable title="Rounds Mode" data={scores.rounds} />
                    <ScoreTable title="Time Attack Mode" data={scores.time} />
                </div>
            )}
        </div>
    );
};

export default Highscores;
