import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { jwtDecode } from 'jwt-decode';

interface LinkedInIdTokenPayload {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string; // user identifier
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const code = searchParams.get('code');
  const rawState = searchParams.get('state');

  if (!code || !rawState) {
    return NextResponse.json(
      { error: 'Missing authorization code or state' },
      { status: 400 }
    );
  }

  let stateObj: { csrf: string; personId: string };
  try {
    stateObj = JSON.parse(decodeURIComponent(rawState));
  } catch {
    return NextResponse.json(
      { error: 'Invalid state parameter format' },
      { status: 400 }
    );
  }

  const { csrf, personId } = stateObj;

  if (!personId || csrf !== 'secureRandomState') {
    return NextResponse.json(
      { error: 'Missing personId or invalid csrf state' },
      { status: 400 }
    );
  }

  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!redirectUri || !clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'LinkedIn OAuth environment variables not configured' },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const errorBody = await tokenRes.text();
      return NextResponse.json(
        { error: 'Failed to get access token', details: errorBody },
        { status: tokenRes.status }
      );
    }

    const tokenData = await tokenRes.json();
    const { id_token } = tokenData;

    if (!id_token) {
      return NextResponse.json({ error: 'Missing id_token' }, { status: 500 });
    }

    const decoded = jwtDecode<LinkedInIdTokenPayload>(id_token);

    await updateDoc(doc(db, 'people', personId), {
      connectedWithLinkedIn: true,
      name: decoded.name ?? '',
      email: decoded.email ?? '',
      photoUrl: decoded.picture ?? '',
      linkedInUrl: decoded.sub ? `https://linkedin.com/in/${decoded.sub}` : '',
    });

    // return NextResponse.json({ success: true });
    return NextResponse.redirect('http://localhost:3000/linkedin/success');

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
