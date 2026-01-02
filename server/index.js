const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { generateRound } = require('./utils/math');

const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Highscore Data Path
const DATA_DIR = path.join(__dirname, 'data');
const HIGHSCORE_FILE = path.join(DATA_DIR, 'highscores.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure highscore file exists
if (!fs.existsSync(HIGHSCORE_FILE)) {
    fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify({ rounds: [], time: [] }));
}

const getHighscores = () => {
    try {
        const data = fs.readFileSync(HIGHSCORE_FILE);
        return JSON.parse(data);
    } catch (e) {
        return { rounds: [], time: [] };
    }
};

const saveHighscore = (category, newScore) => {
    const data = getHighscores();
    const list = data[category] || [];

    list.push(newScore);
    // Sort descending by score
    list.sort((a, b) => b.score - a.score);
    // Keep top 10
    data[category] = list.slice(0, 10);

    fs.writeFileSync(HIGHSCORE_FILE, JSON.stringify(data, null, 2));
    return data;
};

// API Routes
app.get('/api/highscores', (req, res) => {
    res.json(getHighscores());
});

app.post('/api/highscores', (req, res) => {
    // Expect: { gameType: 'rounds'|'time', score: number, mode: string, details: string, date: string }
    const { gameType, score, mode, details } = req.body;

    if (!['rounds', 'time'].includes(gameType)) {
        return res.status(400).json({ error: 'Invalid game type' });
    }

    const newEntry = {
        score,
        mode,
        details,
        date: new Date().toISOString()
    };

    const updated = saveHighscore(gameType, newEntry);
    res.json(updated);
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In production, restrict this
        methods: ["GET", "POST"]
    }
});

// State
const rooms = new Map(); // roomId -> { players: [], state: 'waiting'|'playing', round: 0, scores: {}, config: {} }

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', ({ roomId, username }) => {
        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                players: [],
                state: 'waiting',
                scores: {},
                config: { mode: 'add', rounds: 10 } // Default
            });
        }

        const room = rooms.get(roomId);

        // Add player if new
        if (!room.players.find(p => p.id === socket.id)) {
            room.players.push({ id: socket.id, username, score: 0 });
            room.scores[socket.id] = 0;
        }

        io.to(roomId).emit('room_update', {
            players: room.players,
            state: room.state,
            config: room.config
        });
    });

    socket.on('start_game', ({ roomId, config }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        room.state = 'playing';
        room.config = config;
        room.round = 1;
        // Reset scores
        room.players.forEach(p => p.score = 0);

        // Generate First Round
        const roundData = generateRound(config.mode, 1);
        room.currentRoundData = roundData; // Store answer on server

        io.to(roomId).emit('game_start', {
            roundData: { ...roundData, winnerId: undefined }, // Hide winner? Or send it and trust client? 
            // For simplicity/anti-cheat, we should hide it, but for this simple game sending it is easier for verifying "correctness" locally if we want instant feedback.
            // Actually, let's send full data for now for responsiveness.
            fullRoundData: roundData
        });
    });

    socket.on('player_answer', ({ roomId, answerId }) => {
        const room = rooms.get(roomId);
        if (!room || room.state !== 'playing') return;

        const isCorrect = answerId === room.currentRoundData.winnerId;
        const player = room.players.find(p => p.id === socket.id);

        if (player && isCorrect) {
            // First correct answer wins the round? Or everyone gets points?
            // "Score will be added and next round starts"
            // If "next round starts" implies global round, then it's a race.
            // "Mode of the level can be chosen by round or by time"

            player.score += 10;

            // Broadcast round winner and next round
            io.to(roomId).emit('round_result', {
                winnerName: player.username,
                winnerId: player.id,
                scores: room.players.map(p => ({ id: p.id, score: p.score }))
            });

            // Delay next round
            setTimeout(() => {
                room.round++;
                if (room.round > 10) { // Limit for now
                    room.state = 'finished';
                    io.to(roomId).emit('game_over', { scores: room.players });
                } else {
                    const diff = Math.floor(Math.max(...room.players.map(p => p.score)) / 50) + 1;
                    room.currentRoundData = generateRound(room.config.mode, diff);
                    io.to(roomId).emit('next_round', { fullRoundData: room.currentRoundData, roundNum: room.round });
                }
            }, 2000);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Cleanup logic (remove from room)
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
