import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let socketIOInstance;

export const setupSocket = (httpServer) => {
    socketIOInstance = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    socketIOInstance.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    socketIOInstance.on('connection', (socket) => {
        console.log(`User connected: ${socket.userId}`);

        // join user-specific room
        socket.join(socket.userId);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });

    console.log('Socket initialized');

    return socketIOInstance;
};

export const getSocketInstance = () => {
    if (!socketIOInstance) {
        throw new Error('Socket.io Instance created');
    }
    return socketIOInstance;
};