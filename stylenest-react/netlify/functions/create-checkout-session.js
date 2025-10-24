import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('STRIPE_SECRET_KEY is not set in Netlify function environment');
}
const stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });

export async function handler(event, context) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { items = [], successUrl, cancelUrl } = body;

    if (!items || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No items provided' }) };
    }

    const line_items = items.map((it) => ({
      price_data: {
        currency: 'brl',
        product_data: { name: it.name, images: it.image ? [it.image] : undefined },
        unit_amount: Math.round((it.price || 0) * 100),
      },
      quantity: it.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: successUrl || `${process.env.URL}/pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.URL}/pagamento`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error('create-checkout-session function error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
