'use client';

import { Event } from '@/types/event';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const { id, title, date, time, location, bannerUrl, category, isFeatured } =
    event;

  return (
    <Link href={`/events/${id}`}>
      <Card className='hover:shadow-lg transition-shadow duration-200 overflow-hidden'>
        <div className='relative h-48 w-full'>
          <Image
            src={bannerUrl || '/default-banner.jpg'}
            alt={title}
            fill
            className='object-cover'
          />
          {isFeatured && (
            <div className='absolute top-2 right-2 text-yellow-400 drop-shadow-lg'>
              <Star className='w-5 h-5 text-yellow-400' fill='currentColor' />
            </div>
          )}
        </div>

        <CardHeader className='space-y-1'>
          <CardTitle className='text-lg font-semibold'>{title}</CardTitle>
          <div className='text-sm text-muted-foreground capitalize'>
            {category}
          </div>
        </CardHeader>

        <CardContent className='text-sm space-y-1'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='w-4 h-4' />
            <span>
              {date} at {time}
            </span>
          </div>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <MapPin className='w-4 h-4' />
            <span>{location}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
