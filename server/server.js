// LovelyCam V4.0 - Main Production Node.js Server
require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const argon2 = require('argon2');
const setupSocketIO = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '2mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150,
    message: { error: 'Çok fazla istek gönderildi, lütfen 15 dakika sonra tekrar deneyin.' }
});
app.use('/api/', apiLimiter);

// Serve Frontend Static Files
const rootDir = path.join(__dirname, '..');
app.use(express.static(rootDir));

// Healthcheck & API Endpoints
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: '4.0.0', engine: 'Node.js + Socket.IO + Argon2id + AES-256-GCM' });
});

app.post('/api/auth/hash-argon2id', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) return res.status(400).json({ error: 'Geçersiz parola' });
        const hash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
        res.json({ hash });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

setupSocketIO(io);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`🚀 LovelyCam V4.0 Sunucusu http://localhost:${PORT} adresinde çalışıyor`);
    });
}

module.exports = { app, server };
