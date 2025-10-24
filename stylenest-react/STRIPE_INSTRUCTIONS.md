Stripe test server (local)

This project includes a small Express test server at `server/index.js` which creates Stripe Checkout sessions for card payments.

Setup

1. Copy `.env.example` to `.env` and fill your test keys (do NOT commit real keys):

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

2. Install dependencies and run both servers (frontend and test server) in separate terminals:

```powershell
npm install
npm run dev          # start Vite frontend
npm run start:server # start the Stripe test server on port 4242
```

3. The frontend calls `POST http://localhost:4242/create-checkout-session` with body like:

```json
{
  "items": [{ "id": "prod-1", "name": "Camiseta", "price": 119.9, "quantity": 1, "image": "https://..." }],
  "successUrl": "http://localhost:5173/pagamento?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "http://localhost:5173/pagamento"
}
```

The server will respond with `{ "url": "https://checkout.stripe.com/...?session=..." }` — redirect the browser to that URL to open Stripe Checkout (test).

Notes

- Use Stripe test cards (e.g. card number `4242 4242 4242 4242`, any valid future expiry, CVC 123) on Checkout.
- Keep your secret key private. Use test-only keys here and don't commit them to version control.
