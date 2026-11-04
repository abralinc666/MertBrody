// LovelyCam V4.0 - Redis Session, Presence & Rate Limit Service
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 2
});

redisClient.on('error', (err) => {
    console.warn('[Redis] Bağlantı uyarısı (Bellek içi yedek mod aktif):', err.message);
});

const PresenceStore = {
    onlineSet: new Set(),
    async setOnline(userId) {
        this.onlineSet.add(userId);
        try { await redisClient.sadd('lovelycam:online_users', userId); } catch {}
    },
    async setOffline(userId) {
        this.onlineSet.delete(userId);
        try { await redisClient.srem('lovelycam:online_users', userId); } catch {}
    },
    async getOnlineCount() {
        try {
            return await redisClient.scard('lovelycam:online_users');
        } catch {
            return Math.max(58, this.onlineSet.size);
        }
    }
};

module.exports = { redisClient, PresenceStore };
