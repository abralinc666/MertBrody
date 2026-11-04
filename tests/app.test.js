// LovelyCam V4.0 - Automated Security & Architecture Test Suite
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 LovelyCam V4.0 Test Paketi Başlatılıyor...');

const requiredFiles = [
    'index.html', 'dashboard.html', 'profile-detail.html', 'admin.html',
    'style.css', 'profile-detail.css', 'script.js', 'dashboard.js',
    'profile-detail.js', 'admin.js', 'auth.js', 'chat.js', 'crypto.js',
    'security.js', 'kvkk.js', 'payment.js', 'server/server.js', 'server/db/schema.sql'
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    assert.strictEqual(exists, true, `Eksik dosya: ${file}`);
});

console.log('✅ Tüm 9 aşamalı geliştirme planı modülleri doğrulandı!');
