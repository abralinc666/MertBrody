// Katalog tek yerden okunur: hem /api/products hem /api/order kullanır.
const data = require('../data/products.json');

const gameBySlug = Object.fromEntries(data.games.map((g) => [g.slug, g]));
const productById = new Map(data.products.map((p) => [p.id, p]));

module.exports = { games: data.games, products: data.products, gameBySlug, productById };
