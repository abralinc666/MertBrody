const { productById } = require('../lib/catalog');

// Fiyat HER ZAMAN sunucuda yeniden hesaplanır; istemciden gelen tutara güvenilmez.
module.exports = (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Yalnızca POST' });
  const items = Array.isArray(req.body && req.body.items) ? req.body.items.slice(0, 20) : [];
  if (!items.length) return res.status(400).json({ error: 'Sepet boş.' });

  const lines = [];
  let total = 0;
  for (const it of items) {
    const p = productById.get(Number(it.id));
    const qty = Math.floor(Number(it.qty));
    if (!p || !Number.isFinite(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ error: 'Geçersiz ürün veya adet.' });
    }
    if (!p.inStock) return res.status(409).json({ error: `${p.name} stokta yok.` });
    const sub = Math.round(p.price * qty * 100) / 100;
    total = Math.round((total + sub) * 100) / 100;
    lines.push({ id: p.id, name: p.name, qty, price: p.price, subtotal: sub });
  }
  // DEMO: sipariş saklanmaz ve ödeme alınmaz (bkz. README → "Sıradaki adımlar").
  const ref = 'EP-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  res.status(200).json({ ok: true, demo: true, ref, total, lines });
};
