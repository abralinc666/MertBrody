// LovelyCam V4.0 - Socket.IO Realtime Chat, E2EE Signaling & Online Presence
const { PresenceStore } = require('../config/redis');

module.exports = function setupSocketIO(io) {
    io.on('connection', async (socket) => {
        const userId = socket.handshake.auth?.userId || socket.id;
        await PresenceStore.setOnline(userId);
        socket.join(`user:${userId}`);

        const count = await PresenceStore.getOnlineCount();
        io.emit('presence:count', { onlineCount: count });

        socket.on('chat:global', (msg) => {
            io.emit('chat:global:new', msg);
        });

        socket.on('chat:private:e2ee', (payload) => {
            if (payload && payload.recipientId) {
                io.to(`user:${payload.recipientId}`).emit('chat:private:incoming', payload);
            }
        });

        socket.on('chat:typing', ({ recipientId, senderName }) => {
            io.to(`user:${recipientId}`).emit('chat:typing', { senderName });
        });

        socket.on('disconnect', async () => {
            await PresenceStore.setOffline(userId);
            const updatedCount = await PresenceStore.getOnlineCount();
            io.emit('presence:count', { onlineCount: updatedCount });
        });
    });
};
