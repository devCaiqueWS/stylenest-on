import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn("WARNING: STRIPE_SECRET_KEY is not set. The server will not work until you set it in .env");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2022-11-15" });

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, message: "Stripe test server running" }));

// Create a Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items = [], successUrl, cancelUrl } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Build line_items for Stripe Checkout
    const line_items = items.map((it) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: it.name,
          images: it.image ? [it.image] : undefined,
        },
        unit_amount: Math.round((it.price || 0) * 100),
      },
      quantity: it.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: successUrl || `http://localhost:5173/pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `http://localhost:5173/pagamento`,
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Create a PaymentIntent for on-site Stripe Elements payments
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { items = [], currency = "brl", amount: amountFromClient } = req.body;

    // If the client provided an explicit amount (in cents), trust it. Otherwise compute from items.
    let amount = 0;

    if (typeof amountFromClient === "number" && amountFromClient > 0) {
      amount = Math.round(amountFromClient);
    } else {
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "No items provided" });
      }

      // Calculate total amount (in smallest currency unit, e.g., cents)
      amount = items.reduce((sum, it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 1);
        return sum + Math.round(price * 100) * qty;
      }, 0);
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // Let the client confirm the payment; optional metadata
      metadata: { integration_check: "accept_a_payment" },
      payment_method_types: ["card"],
    });

    return res.json({ clientSecret: paymentIntent.client_secret, amount });
  } catch (err) {
    console.error("create-payment-intent error:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Stripe test server listening on http://localhost:${port}`);
});
