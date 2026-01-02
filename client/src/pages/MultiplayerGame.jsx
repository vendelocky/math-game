import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { socket } from '../socket';

const MultiplayerGame = ({ initialData, onEnd }) => {
    const [roundData, setRoundData] = useState(initialData.fullRoundData);
    const [score, setScore] = useState(0); // My Score
    const [opponentScores, setOpponentScores] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        socket.on('round_result', (data) => {
            if (data.winnerName) {
                setMsg(`${data.winnerName} won the round!`);
            }
            setOpponentScores(data.scores);
            // Wait for next round event
        });

        socket.on('score_update', (data) => {
            setOpponentScores(data.scores);
        });

        socket.on('next_round', (data) => {
            setFeedback(null);
            setMsg('');
            setRoundData(data.fullRoundData);
        });

        socket.on('game_over', (data) => {
            setMsg('Game Over!');
            setOpponentScores(data.scores);
            // Show final results
            setTimeout(onEnd, 5000);
        });

        return () => {
            socket.off('round_result');
            socket.off('score_update');
            socket.off('next_round');
            socket.off('game_over');
        };
    }, [onEnd]);

    const processSelection = (selectedId) => {
        if (feedback) return;

        // Speculative feedback? No, wait for result? 
        // Or server checks correctness? 
        // In this code, we send answer to server.
        socket.emit('player_answer', { roomId: initialData.roomId, answerId: selectedId });

        // Wait, I need roomId. I didn't pass it.
        // I can get it from closure if I stored it, but best to pass it in props.
        // For now let's hack it or fix App to pass roomId.

        // Let's assume we implement correct feedback locally if we want, 
        // but strictly we should wait for server.
        // However, to be snappy, we check against local `roundData.winnerId` (which we sent from server).
        const isCorrect = selectedId === roundData.winnerId;
        setFeedback({ selectedId, isCorrect, correctId: roundData.winnerId });

        if (isCorrect) {
            // Emit win
            // The server listener handles the rest.
            // We need 'roomId' available.
        }
    };

    // FIX: We need roomId availability. 
    // I will rely on the socket instance state or pass it.

    return (
        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <h3>Scores:</h3>
                {opponentScores.map(p => <span key={p.id}>{p.id.substr(0, 4)}: {p.score}</span>)}
            </div>

            <h2>{msg || "Which is BIGGER?"}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                {roundData && roundData.options.map((opt) => {
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
                            onClick={() => {
                                // Quick fix: emit to all rooms I'm in? or just the generic one?
                                // Socket.io standard emit sends to server. Server knows which room I am in by `socket.rooms`? 
                                // No, server `socket.rooms` is a Set. 
                                // Ideally client sends roomId.
                                // I'll update Lobby to pass roomId to App then here.
                                processSelection(opt.id);
                            }}
                            disabled={!!feedback}
                        />
                    );
                })}
            </div>
        </div>
    );
}; // Wait, I need to pass roomId.

export default MultiplayerGame;
