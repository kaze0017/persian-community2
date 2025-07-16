// pages/api/webhook.ts
import { buffer } from 'micro';
import Stripe from 'stripe';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export default async function handler(req, res) {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  // Handle checkout success
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;

    // Save reservation/ticket in DB
    // Send confirmation email with QR code
    console.log('💰 Payment complete for:', email);
  }

  res.status(200).json({ received: true });
}
