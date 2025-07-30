'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/types/event';
import { useEffect } from 'react';
import OptimizedBanner from '../OptimizedBanner';

interface Props {
  events: Event[]; // Assuming events have a banner property with Banner type
}

export default function EventCarousel({ events }: Props) {
  const [ref, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  useEffect(() => {
    if (!slider) return;
    const interval = setInterval(() => {
      slider.current?.next();
    }, 300000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <div className='w-full space-y-6'>
      {/* Main Carousel */}
      <div ref={ref} className='keen-slider w-full rounded-xl overflow-hidden'>
        {events.map((event) => {
          return (
            <div
              key={event.id}
              className='keen-slider__slide relative bg-gray-200'
            >
              <div className='relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[5/2]'>
                <OptimizedBanner
                  banner={event.bannerUrls}
                  alt={event.title}
                  className='object-cover brightness-50'
                  loading='lazy'
                />

                {/* Overlay */}
                <div className='absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-black/60 via-black/30 to-transparent text-white'>
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
            </div>
          );
        })}
      </div>

      {/* Header & Strip */}
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-semibold text-foreground'>Events</h3>
          <Link
            href='/events'
            className='text-sm font-medium text-primary hover:underline'
          >
            View All Events
          </Link>
        </div>

        {/* Thumbnails */}
        <div className='flex overflow-x-auto gap-4 pb-1'>
          {events.map((event) => (
            <Link
              href={`/events/${event.id}`}
              key={`strip-${event.id}`}
              className='flex-none w-[100px] sm:w-[120px] rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition'
            >
              <div className='relative w-full aspect-[16/9] bg-gray-200'>
                {/* Using Next.js Image with sizes and fill */}
                <Image
                  src={
                    (event as any).banner?.sizes?.small ||
                    event.bannerUrls?.sizes?.small ||
                    '/default-banner.jpg'
                  }
                  alt={event.title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 640px) 100px, 120px'
                  priority={false}
                />
              </div>
              <div className='text-xs p-1 truncate'>{event.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
