import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  try {
    // Use .json() to parse JSON body
    const body = await req.json(); // <-- this is correct

    console.log('✅ Received body:', body);

    if (!body.priceId) {
      return NextResponse.json({ ok: false, error: 'Missing priceId' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return NextResponse.json({ ok: true, result: session });
  } catch (err: any) {
    console.error('❌ Stripe error:', err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
