'use strict';

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';

app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

const products = [
  { id: 'p1', name: 'Taze Çilek', category: 'Meyve & Sebze', price: 69.90, unit: '500 g', icon: '🍓', color: 'rose', badge: 'Günün ürünü' },
  { id: 'p2', name: 'Organik Süt', category: 'Süt & Kahvaltı', price: 34.50, unit: '1 L', icon: '🥛', color: 'blue', badge: 'Popüler' },
  { id: 'p3', name: 'Tam Buğday Ekmek', category: 'Fırın', price: 29.90, unit: '400 g', icon: '🍞', color: 'amber', badge: '' },
  { id: 'p4', name: 'Avokado', category: 'Meyve & Sebze', price: 42.00, unit: 'adet', icon: '🥑', color: 'green', badge: '' },
  { id: 'p5', name: 'Filtre Kahve', category: 'İçecek', price: 119.90, unit: '250 g', icon: '☕', color: 'coffee', badge: 'Çok satan' },
  { id: 'p6', name: 'Makarna', category: 'Temel Gıda', price: 24.90, unit: '500 g', icon: '🍝', color: 'yellow', badge: '' },
  { id: 'p7', name: 'Yumurta', category: 'Süt & Kahvaltı', price: 79.90, unit: '10 adet', icon: '🥚', color: 'cream', badge: '' },
  { id: 'p8', name: 'Portakal Suyu', category: 'İçecek', price: 54.90, unit: '1 L', icon: '🍊', color: 'orange', badge: 'Yeni' }
];

app.get('/api/products', (_req, res) => res.json({ products }));

// This demo intentionally does not collect payment credentials or OTPs.
// A real checkout must be completed on a PCI-compliant provider's hosted page.
const checkoutLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
app.post('/api/checkout', checkoutLimiter, (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return res.status(400).json({ error: 'Sepet bilgisi geçersiz.' });
  }
  const normalized = [];
  for (const item of items) {
    const product = products.find((entry) => entry.id === item?.id);
    const quantity = Number(item?.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ error: 'Sepette geçersiz ürün veya adet var.' });
    }
    normalized.push({ id: product.id, name: product.name, quantity, unitPrice: product.price });
  }
  const total = normalized.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  return res.status(501).json({
    status: 'payment_provider_required',
    message: 'Demo modu: ödeme alınmaz. Canlı ödeme için lisanslı ödeme sağlayıcısının barındırılan ödeme sayfası entegre edilmelidir.',
    items: normalized,
    total: Number(total.toFixed(2))
  });
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/{*splat}', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, HOST, () => {
  console.log(`Demo mağaza hazır: http://${HOST}:${PORT}`);
});
