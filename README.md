# Market — Node.js storefront demo

Independent storefront interface built with Node.js, Express, HTML, CSS and browser JavaScript. The page uses the product photographs and catalog data supplied in the source archive, while presenting them in a separate demo storefront identity.

## Requirements
- Node.js 20+

## Run locally
```bash
npm install
npm start
```
Open `http://127.0.0.1:3000`.

## Included
- Express REST endpoint: `GET /api/products` with `q`, `category` and `sort` filters.
- 48 catalog records and locally stored product photographs.
- Responsive landing page, category navigation, search, sorting and cart drawer.
- LocalStorage cart persistence.
- GSAP product entrance animations (loaded from CDN).
- Helmet security headers and API rate limiting.

## Safety and scope
- This is an independent demo storefront, not an official A101 website and not affiliated with A101.
- The demo does not collect login credentials, payment card data, CVV, bank credentials or one-time verification codes.
- The checkout button is intentionally non-transactional. For a legitimate production store, integrate a licensed payment provider using its hosted checkout flow; do not store CVV or OTP values.

## Validation
Run `node --check server.js` and `node --check public/app.js` for syntax checks. A live server test additionally requires installing dependencies with `npm install`.
