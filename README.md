# Node.js storefront conversion

## Run
- Node.js 20+
- `npm install`
- `npm start`
- Open http://127.0.0.1:3000

## Included
- Express API and local JSON catalog derived from the supplied SQL product records.
- Original product photographs copied from the supplied project into `public/assets/products/` (no remote image dependency).
- Original webfont files included locally.
- Search, category filtering, sorting and localStorage cart.
- GSAP entrance animation (CDN).

## Safety boundary
This is an independent storefront demo. It does not reproduce the original branded payment/OTP collection flow and does not collect card numbers, CVV, bank credentials or one-time codes. A production checkout must redirect to a legitimate payment provider's hosted checkout.
