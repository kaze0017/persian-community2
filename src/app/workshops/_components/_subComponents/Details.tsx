'use client';
import React from 'react';
import Image from 'next/image';
import { Workshop } from '@/types/workshop';
import { format, parseISO } from 'date-fns';
import { ExternalLinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface DetailsProps {
  workshop: Workshop;
}

export default function Details({ workshop }: DetailsProps) {
  const router = useRouter();
  if (!workshop) return null;

  return (
    <div className='flex flex-col gap-6'>
      {/* Banner */}
      <div className='w-full h-48 rounded-md overflow-hidden bg-muted'>
        {workshop.bannerUrl ? (
          <Image
            src={workshop.bannerUrl}
            alt='Workshop Banner'
            width={800}
            height={192}
            className='object-cover w-full h-full'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className='text-xl font-bold'>{workshop.title}</h2>

      <div className='flex gap-6 items-start'>
        {/* Instructor Image */}
        {workshop.instructor?.photoUrl && (
          <a
            href={workshop.instructor.linkedInUrl ?? '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='block shrink-0 w-16 h-16 rounded-full overflow-hidden border'
            title='View LinkedIn Profile'
          >
            <Image
              src={workshop.instructor.photoUrl}
              alt={workshop.instructor.name ?? 'Instructor'}
              width={64}
              height={64}
              className='object-cover w-full h-full'
            />
          </a>
        )}

        {/* Workshop Info */}
        <div className='flex-1 grid grid-cols-2 gap-2 text-sm text-muted-foreground'>
          <div>
            <strong>Instructor:</strong> {workshop.instructor?.name ?? 'N/A'}
            {workshop.instructor?.linkedInUrl && (
              <a
                href={workshop.instructor.linkedInUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-1 inline-block text-blue-500'
              >
                <ExternalLinkIcon className='inline w-3 h-3' />
              </a>
            )}
          </div>
          <div>
            <strong>Price:</strong>{' '}
            {workshop.price > 0 ? `$${workshop.price}` : 'Free'}
          </div>
          <div>
            <strong>Capacity:</strong> {workshop.capacity ?? 'Not specified'}
          </div>
          <div>
            <strong>Language:</strong> {workshop.language ?? 'Not specified'}
          </div>
          <div>
            <strong>Category:</strong> {workshop.category}
          </div>
          <div>
            <strong>Start Date:</strong>{' '}
            {format(parseISO(workshop.startDate), 'PPP')}
          </div>
          <div>
            <strong>End Date:</strong>{' '}
            {format(parseISO(workshop.endDate), 'PPP')}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className='font-semibold text-sm mb-2'>Description</h4>
        <p className='text-sm text-muted-foreground'>
          {workshop.description ?? 'No description provided.'}
        </p>
      </div>

      {/* Register Button */}
      <div className='mt-6'>
        <Button
          onClick={() => router.push(`/workshops/register/${workshop.id}`)}
          className='w-full'
        >
          Register
        </Button>
      </div>
    </div>
  );
}
