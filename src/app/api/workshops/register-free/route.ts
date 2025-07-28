// src/app/api/register-free/route.ts
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
 
  const formData = await req.formData();
  const workshopId = formData.get('workshopId');
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');

  // Validate inputs
  if (!workshopId || typeof workshopId !== 'string') {
    return NextResponse.json({ error: 'Invalid workshopId' }, { status: 400 });
  }
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!phone || typeof phone !== 'string') {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  try {
    await addDoc(collection(db, `workshops/${workshopId}/registrations`), {
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      type: 'free',
      name,
      email,
      phone,
    });
  } catch (error) {
    console.error('Failed to register:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }

  return NextResponse.redirect(`http://localhost:3000/workshops/register/${workshopId}/success`);
}
