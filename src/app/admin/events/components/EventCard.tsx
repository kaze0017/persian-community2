'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // If you have a utility for conditional classNames

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    date: string; // format YYYY-MM-DD or similar
    bannerUrl?: string;
  };
};

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  return (
    <Card
      role='button'
      tabIndex={0}
      onClick={() => router.push(`/events/${event.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          router.push(`/admin/create-event?id=${event.id}`);
        }
      }}
      className={cn(
        'relative cursor-pointer overflow-hidden transition hover:shadow-lg',
        'min-h-[200px] rounded-xl',
        'text-white'
      )}
      style={{
        backgroundImage: event.bannerUrl
          ? `url(${event.bannerUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/80' />

      <CardContent className='relative flex flex-col justify-end h-full p-4'>
        <h3 className='text-lg font-semibold'>{event.title}</h3>
        <p className='text-sm line-clamp-2'>{event.description}</p>
        <p className='mt-2 text-xs italic'>{event.date}</p>
      </CardContent>
    </Card>
  );
}
