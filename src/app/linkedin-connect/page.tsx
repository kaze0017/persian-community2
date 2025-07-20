'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LinkedinIcon } from 'lucide-react';

export default function LinkedInConnectPage() {
  const searchParams = useSearchParams();
  const personId = searchParams.get('personId');

  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    if (!personId) {
      setError('Missing personId, cannot connect LinkedIn.');
      return;
    }

    // Prepare state with CSRF and personId encoded as JSON
    const stateObj = { csrf: 'secureRandomState', personId };
    const state = encodeURIComponent(JSON.stringify(stateObj));

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`,
      state,
      scope: 'openid profile email',
    });

    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    window.location.href = linkedinAuthUrl;
  };

  return (
    <div className='max-w-md mx-auto p-8 text-center'>
      <h1 className='text-2xl font-bold'>Connect Your LinkedIn</h1>
      <p className='text-muted-foreground'>
        Authorize access to your LinkedIn profile.
      </p>

      {error && <p className='text-red-600 mt-2'>{error}</p>}

      <Button
        onClick={handleConnect}
        className='mt-6 flex items-center justify-center gap-2'
      >
        <LinkedinIcon className='w-4 h-4' />
        Connect with LinkedIn
      </Button>
    </div>
  );
}
