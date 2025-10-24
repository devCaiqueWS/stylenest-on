import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('STRIPE_SECRET_KEY is not set in Netlify function environment');
}
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });

export async function handler(event, context) {
  try {
    // Netlify passes raw body as string
    const body = event.body ? JSON.parse(event.body) : {};
    const { items = [], currency = 'brl', amount: amountFromClient } = body;

    let amount = 0;
    if (typeof amountFromClient === 'number' && amountFromClient > 0) {
      amount = Math.round(amountFromClient);
    } else {
      if (!items || items.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'No items provided' }),
        };
      }
      amount = items.reduce((sum, it) => {
        const price = Number(it.price || 0);
        const qty = Number(it.quantity || 1);
        return sum + Math.round(price * 100) * qty;
      }, 0);
    }

    if (amount <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid order amount' }) };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { integration_check: 'accept_a_payment' },
      payment_method_types: ['card'],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ clientSecret: paymentIntent.client_secret, amount }),
    };
  } catch (err) {
    console.error('create-payment-intent function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
