'use strict';
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');
const fs = require('node:fs');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/products.json'), 'utf8'));
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
  imgSrc: ["'self'", 'data:'], fontSrc: ["'self'", 'data:'], connectSrc: ["'self'"]
} } }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
app.get('/api/products', (req, res) => {
 const q = String(req.query.q || '').trim().toLocaleLowerCase('tr-TR');
 const category = String(req.query.category || '').trim();
 const sort = String(req.query.sort || 'recommended');
 let items = products.filter(p => (!q || p.name.toLocaleLowerCase('tr-TR').includes(q) || p.category.toLocaleLowerCase('tr-TR').includes(q)) && (!category || category === 'Tümü' || p.category === category));
 if (sort === 'price-asc') items.sort((a,b) => a.price-b.price);
 if (sort === 'price-desc') items.sort((a,b) => b.price-a.price);
 res.json({ items, total: items.length });
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));
app.get('*', (req,res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.listen(PORT, () => console.log(`Storefront ready: http://127.0.0.1:${PORT}`));
