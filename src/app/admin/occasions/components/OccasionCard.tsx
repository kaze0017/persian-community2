// src/app/occasions/components/OccasionCard.tsx

'use client';

import Image from 'next/image';
import { Occasion } from '@/types/occasions';
import { CalendarDays } from 'lucide-react';

type Props = {
  occasion: Occasion;
};

export default function OccasionCard({ occasion }: Props) {
  return (
    <div className='rounded-lg border p-4 shadow-sm bg-white dark:bg-gray-900'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-2 text-xl font-semibold'>
          <CalendarDays className='w-5 h-5 text-muted-foreground' />
          {occasion.title}
        </div>
        <span className='text-sm text-gray-500'>{occasion.date}</span>
      </div>
      <p className='text-sm text-muted-foreground mb-2'>
        {occasion.description}
      </p>
      {occasion.imageURL && (
        <div className='relative w-full h-32 rounded overflow-hidden'>
          <Image
            src={occasion.imageURL}
            alt={occasion.title}
            fill
            className='object-cover'
          />
        </div>
      )}
    </div>
  );
}
