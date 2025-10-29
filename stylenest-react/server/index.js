import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT || 4242;

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appBaseUrl =
  (process.env.APP_BASE_URL && process.env.APP_BASE_URL.replace(/\/$/, "")) ||
  "http://localhost:5173";
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
    const { items = [], successUrl, cancelUrl, paymentMethod, customer = {} } = req.body;

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

    const allowedPaymentMethods = ["card", "pix"];
    const selectedMethod = allowedPaymentMethods.includes(paymentMethod) ? paymentMethod : "card";
    const payment_method_types = selectedMethod === "pix" ? ["pix"] : ["card"];

    const metadata = {};
    [
      ["customer_nome", customer.nome],
      ["customer_email", customer.email],
      ["customer_telefone", customer.telefone],
      ["customer_endereco", customer.endereco],
      ["customer_complemento", customer.complemento],
      ["customer_cidade", customer.cidade],
      ["customer_estado", customer.estado],
      ["customer_cep", customer.cep],
      ["metodo_pagamento", selectedMethod],
    ].forEach(([key, value]) => {
      if (value) {
        metadata[key] = String(value);
      }
    });

    const sessionPayload = {
      payment_method_types,
      mode: "payment",
      line_items,
      success_url:
        successUrl ||
        `${appBaseUrl}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${appBaseUrl}/checkout`,
    };

    if (Object.keys(metadata).length > 0) {
      sessionPayload.metadata = metadata;
    }

    if (customer.email) {
      sessionPayload.customer_email = customer.email;
    }

    if (selectedMethod === "pix") {
      sessionPayload.payment_method_options = {
        pix: {
          expires_after_seconds: 1800,
        },
      };
    }

    const session = await stripe.checkout.sessions.create({
      ...sessionPayload,
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Stripe test server listening on http://localhost:${port}`);
});
