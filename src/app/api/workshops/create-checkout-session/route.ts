// src/app/api/create-checkout-session/route.ts
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const workshopId = formData.get('workshopId');

  if (!workshopId || typeof workshopId !== 'string') {
    return NextResponse.json({ error: 'Invalid workshopId' }, { status: 400 });
  }

  const workshopSnap = await getDoc(doc(db, 'workshops', workshopId));
  if (!workshopSnap.exists()) {
    return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
  }
  const workshop = workshopSnap.data();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(workshop.price * 100),
          product_data: {
            name: workshop.title,
          },
        },
      },
    ],
    metadata: {
      workshopId,
    },
    success_url: `http://localhost:3000/workshops/register/${workshopId}/success`,
    cancel_url: `http://localhost:3000/workshops/register/${workshopId}`,
  });

  return NextResponse.redirect(session.url!);
}
