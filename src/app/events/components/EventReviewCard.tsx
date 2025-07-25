'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface EventReviewCardProps {
  ev: Event;
}

export default function EventReviewCard({ ev }: EventReviewCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/events/${ev.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className='flex items-center gap-4 border rounded-md p-2 hover:bg-muted/30 transition cursor-pointer'
    >
      {ev.bannerUrl && (
        <Image
          src={
            ev.bannerUrl.startsWith('http')
              ? ev.bannerUrl
              : `/images/events/${ev.bannerUrl}`
          }
          alt={ev.title}
          width={64}
          height={64}
          className='w-16 h-16 object-cover rounded'
        />
      )}

      <div className='flex-1'>
        <p className='font-medium'>{ev.title}</p>
      </div>

      <Button
        variant='ghost'
        size='icon'
        onClick={(e) => {
          e.stopPropagation(); // Prevent parent click
          handleNavigate();
        }}
      >
        <ArrowRight className='h-4 w-4' />
      </Button>
    </div>
  );
}
