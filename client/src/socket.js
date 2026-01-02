import { io } from 'socket.io-client';

// Change URL for production
const URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/';

export const socket = io(URL, {
    autoConnect: false
});
