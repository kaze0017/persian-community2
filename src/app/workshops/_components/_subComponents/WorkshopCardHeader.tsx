'use client';
import { CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Workshop } from '@/types/workshop';

export default function WorkshopCardHeader({
  workshop,
}: {
  workshop: Workshop;
}) {
  return (
    <div className='flex items-stretch gap-4 h-32'>
      <div className='w-48 h-full rounded-md overflow-hidden bg-muted'>
        {workshop.bannerUrl ? (
          <Image
            src={workshop.bannerUrl}
            alt={`${workshop.title} banner`}
            width={192}
            height={128}
            className='object-cover w-full h-full'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
            No Image
          </div>
        )}
      </div>
      <div className='flex flex-col justify-between flex-1'>
        <div className='space-y-1'>
          <CardTitle>{workshop.title}</CardTitle>
          <p className='text-sm text-muted-foreground'>
            {workshop.category} —{' '}
            {new Date(workshop.startDate).toLocaleDateString()}
          </p>
          {workshop.instructor?.name && (
            <p className='text-xs text-muted-foreground mt-2'>
              Instructor: {workshop.instructor.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
