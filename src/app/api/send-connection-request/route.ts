import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/EmailTemplate'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { personId, email, personName } = await req.json();

    if (!email || !personId) {
      return NextResponse.json({ error: 'Missing email or personId' }, { status: 400 });
    }

    const connectionLink = `${process.env.NEXT_PUBLIC_APP_URL}/linkedin-connect?personId=${personId}`;

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: 'Connect your LinkedIn with our app',
      react: EmailTemplate({
        firstName: personName || 'there',
        connectionLink,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
