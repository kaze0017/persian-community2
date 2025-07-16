'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types/event';

interface Props {
  events: Event[];
}

export default function EventCarousel({ events }: Props) {
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div className='w-full space-y-6'>
      {/* Main Carousel */}
      <div
        ref={ref}
        className='keen-slider w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden'
      >
        {events.map((event) => (
          <div
            key={event.id}
            className='keen-slider__slide relative flex items-end justify-between px-4 py-2 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white'
          >
            <div className='absolute inset-0'>
              <Image
                src={event.bannerUrl || '/default-banner.jpg'}
                alt={event.title}
                className='w-full h-full object-cover'
                width={800}
                height={400}
              />
            </div>

            <div className='relative z-10 flex w-full items-end justify-between p-4'>
              <div>
                <div className='font-semibold text-lg'>{event.title}</div>
                <div className='text-xs'>
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>

              <Link
                href={`/events/${event.id}`}
                className='bg-white text-black text-xs font-semibold px-3 py-1 rounded hover:bg-gray-200 transition'
              >
                Check It Out
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Header & Strip */}
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold'>Events</h3>
          <Link
            href='/events'
            className='text-sm font-medium text-blue-600 hover:underline'
          >
            View All Events
          </Link>
        </div>

        {/* File strip */}
        <div className='flex overflow-x-auto gap-4 pb-1'>
          {events.map((event) => (
            <Link
              href={`/events/${event.id}`}
              key={`strip-${event.id}`}
              className='flex-none w-[100px] sm:w-[120px] rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition'
            >
              <Image
                src={event.bannerUrl || '/default-banner.jpg'}
                alt={event.title}
                width={120}
                height={80}
                className='w-full h-[60px] object-cover'
              />
              <div className='text-xs p-1 truncate'>{event.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
