'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Next.js router for client-side navigation
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';

interface EventBookCardProps {
  eventId: string;
  isPaid?: boolean;
  price?: string;
  isAdmin?: boolean; // Optional prop to indicate if the user is an admin
}

export default function EventBookCard({
  eventId,
  isPaid = false,
  price,
  isAdmin = false,
}: EventBookCardProps) {
  const router = useRouter();

  const handleBooking = () => {
    // Navigate to the book page for this event
    router.push(`/events/${eventId}/book`);
  };

  return (
    <GlassPanel>
      {isAdmin && (
        <AdminControlsPanel
          isAdmin={isAdmin}
          title='Header Settings'
          updating={false}
          toggles={[]}
          uploads={[]}
          buttons={[
            {
              label: 'Add Layout',
              onClick: () => router.push(`/admin/salon/${eventId}`),
            },
          ]}
        />
      )}
      <div>
        <CardHeader>
          <CardTitle>Reserve Your Seat</CardTitle>
        </CardHeader>
        <CardContent className='text-muted-foreground text-sm space-y-3'>
          <p>
            Secure your spot for this event. Seats may be limited and will be
            available on a first-come-first-served basis.
          </p>
          <p className='text-xs italic'>
            🚧 Seat selection is under development. Soon you will be able to
            select your exact table and seat.
          </p>

          {isPaid && (
            <div className='border rounded-md p-3 text-xs space-y-1 bg-muted'>
              <p className='font-medium'>🧪 Stripe Test Card for Payments</p>
              <p>
                Use this test card for payments:
                <br />
                <code>4242 4242 4242 4242</code>, Expiry: <code>12/34</code>,
                CVC: <code>123</code>, ZIP: <code>12345</code>
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className='flex justify-center'>
          <Button variant='secondary' onClick={handleBooking}>
            {isPaid && price ? `Book Tickets (${price})` : 'Book Tickets'}
          </Button>
        </CardFooter>
      </div>
    </GlassPanel>
  );
}
