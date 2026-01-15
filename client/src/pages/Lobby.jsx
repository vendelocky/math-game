import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Button from '../components/Button';
import { MODES } from '../engine/MathGenerator';

const Lobby = ({ onStartGame }) => {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [players, setPlayers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);

    // Config state
    const [mode, setMode] = useState(MODES.ADD);
    const [gameType, setGameType] = useState('rounds');
    const [roundCount, setRoundCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(60);

    useEffect(() => {
        // Socket Listeners
        socket.on('room_update', (data) => {
            setPlayers(data.players);
            // Optional: Sync config if we implemented config broadcasting
        });

        socket.on('game_start', (data) => {
            onStartGame(data, roomId);
        });

        return () => {
            socket.off('room_update');
            socket.off('game_start');
        };
    }, [onStartGame, roomId]);

    const handleJoin = () => {
        if (!roomId || !username) return;
        socket.connect();
        socket.emit('join_room', { roomId, username });
        setIsJoined(true);
    };

    const handleStart = () => {
        const config = {
            mode,
            gameType,
            rounds: parseInt(roundCount, 10),
            time: parseInt(timeLimit, 10)
        };
        socket.emit('start_game', { roomId, config });
    };

    if (isJoined) {
        return (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                <h2>Room: {roomId}</h2>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', width: '100%' }}>
                    <h3>Players:</h3>
                    <ul>
                        {players.map(p => <li key={p.id}>{p.username} {p.id === socket.id ? '(You)' : ''}</li>)}
                    </ul>
                </div>

                <div style={{ borderTop: '2px solid #ccc', paddingTop: '1rem', width: '100%' }}>
                    <h3>Game Settings</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {Object.values(MODES).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                style={{
                                    padding: '5px 10px',
                                    background: mode === m ? 'var(--color-primary)' : '#ccc',
                                    color: mode === m ? 'white' : 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select value={gameType} onChange={(e) => setGameType(e.target.value)} style={{ padding: '5px' }}>
                            <option value="rounds">Rounds</option>
                            <option value="time">Time Attack</option>
                        </select>

                        {gameType === 'rounds' ? (
                            <input
                                type="number"
                                min="1" max="1000"
                                value={roundCount}
                                onChange={(e) => setRoundCount(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                style={{ width: '80px', padding: '5px' }}
                            />
                        ) : (
                            <input
                                type="number"
                                min="10" max="3600"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                                style={{ width: '80px', padding: '5px' }}
                            />
                        )}
                        <span>{gameType === 'rounds' ? 'Rounds' : 'Seconds'}</span>
                    </div>
                </div>

                <p style={{ marginTop: '1rem' }}>Waiting for start...</p>
                <Button onClick={handleStart} variant="primary">START GAME</Button>
            </div>
        );
    }

    return (
        <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
            <h1>Multiplayer Lobby</h1>
            <input
                type="text"
                placeholder="Enter Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                style={{ padding: '0.5rem', fontSize: '1.2rem', borderRadius: '8px', border: '2px solid #ccc' }}
            />
            <input
                type="text"
                placeholder="Room ID (e.g. 123)"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                style={{ padding: '0.5rem', fontSize: '1.2rem', borderRadius: '8px', border: '2px solid #ccc' }}
            />
            <Button onClick={handleJoin} disabled={!username || !roomId}>JOIN ROOM</Button>
        </div>
    );
};

export default Lobby;
