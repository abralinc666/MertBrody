const { games, products } = require('../lib/catalog');

module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Yalnızca GET' });
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).json({ games, products });
};
