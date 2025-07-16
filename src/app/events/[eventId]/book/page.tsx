'use client';

import { useParams } from 'next/navigation';
import EventLayoutPreview from './components/EventLayoutPreview';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SubscribeComponent from '@/app/components/SubscribeComponent';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function BookSeatsPage() {
  const { eventId } = useParams();
  if (typeof eventId !== 'string') return null;

  return (
    <div className='max-w-[1280px] mx-auto px-4 py-10 space-y-12'>
      <h1 className='text-3xl font-bold'>Book Your Seat</h1>

      {/* Donation Section */}
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle>Support Our Project</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm'>
            This page is <strong>under development</strong>. The payment process
            is currently for <em>testing purposes only</em>. Please use the test
            card info below.
          </p>

          <SubscribeComponent
            priceId='price_1Rj8JCDIS4dvpSxZclPCgr9i'
            price='$10.00'
            description='a one-time donation'
          />

          <div className=' italic text-muted-foreground border-t pt-3 mt-3'>
            <p>
              🧪 <strong>Stripe Test Card Info for Payments:</strong>
            </p>
            <p>
              Card Number: <code>4242 4242 4242 4242</code>
            </p>
            <p>
              Expiry: <code>12/34</code> &nbsp; CVC: <code>123</code>
            </p>
            <p>
              ZIP: <code>123456</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Layout Preview */}
      <Card className='max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle>Event Layout Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <EventLayoutPreview eventId={eventId} />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex justify-center pt-8'>
        <Link href={`/events/${eventId}`}>
          <Button variant='secondary'>Back to Event Page</Button>
        </Link>
      </div>
    </div>
  );
}
