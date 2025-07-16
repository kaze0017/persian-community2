'use client';

import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  priceId: string;
  price: string;
  description: string;
};

const SubscribeComponent = ({ priceId, price, description }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!stripePublicKey) {
      console.error('❌ Stripe public key is missing');
      alert('Payment setup error: missing Stripe key.');
      return;
    }

    setLoading(true);

    try {
      const stripe = await loadStripe(stripePublicKey);
      if (!stripe) {
        alert('Failed to initialize Stripe.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        '/api/stripe/checkout',
        { priceId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { ok, result } = response.data;

      if (!ok) throw new Error('Something went wrong during checkout.');

      await stripe.redirectToCheckout({
        sessionId: result.id,
      });
    } catch (error: unknown) {
      let message = 'Unknown error';

      if (error instanceof Error) {
        message = error.message;
      }

      console.error('Stripe checkout error:', message);
      alert(`Payment error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-2'>
      <p className='text-sm text-muted-foreground'>
        Click the button below to support us with {description}.
      </p>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : `Support Us for ${price}`}
      </Button>
    </div>
  );
};

export default SubscribeComponent;
