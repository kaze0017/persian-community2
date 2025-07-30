'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils'; // If you have a utility for conditional classNames
import { Banner } from '@/types/banner'; // Adjust the import path as needed

type EventCardProps = {
  event: {
    id: string;
    title: string;
    description: string;
    date: string; // format YYYY-MM-DD or similar
    bannerUrls?: Banner;
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
          router.push(`/events/${event.id}`);
        }
      }}
      className={cn(
        'relative cursor-pointer overflow-hidden transition hover:shadow-lg',
        'min-h-[200px] rounded-xl',
        'text-white'
      )}
    >
      {/* Responsive Banner */}
      {event.bannerUrls && (
        <picture>
          <source
            srcSet={event.bannerUrls.sizes.small}
            media='(max-width: 480px)'
          />
          <source
            srcSet={event.bannerUrls.sizes.medium}
            media='(max-width: 768px)'
          />
          <source
            srcSet={event.bannerUrls.sizes.large}
            media='(max-width: 1080px)'
          />
          <img
            src={event.bannerUrls.sizes.xlarge || event.bannerUrls.original}
            alt={event.title}
            className='absolute inset-0 h-full w-full object-cover'
          />
        </picture>
      )}

      {/* Overlay */}
      <div className='absolute inset-0 bg-black/60' />

      <CardContent className='relative flex flex-col justify-end h-full p-4'>
        <h3 className='text-lg font-semibold'>{event.title}</h3>
        <p className='text-sm line-clamp-2'>{event.description}</p>
        <p className='mt-2 text-xs italic'>{event.date}</p>
      </CardContent>
    </Card>
  );
}
