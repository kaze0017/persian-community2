'use client';

import React, { RefObject, useEffect, useState } from 'react';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Event } from '@/types/event';
import { Business } from '@/types/business';
import { Workshop } from '@/types/workshop';

import {
  useKeenSlider,
  KeenSliderPlugin,
  KeenSliderInstance,
} from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import BusinessesSlides from './BusinessesSlides';
import SwiperDeckOfCards from './SwiperDeckOfCards';
import SectionHeader from './SectionHeader';
import { boxShadow } from '@/app/components/filters/logoFilter';

function ThumbnailPlugin(
  mainRef: RefObject<KeenSliderInstance | null>
): KeenSliderPlugin {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove('active');
      });
    }

    function addActive(idx: number) {
      slider.slides[idx]?.classList.add('active');
    }

    function addClickEvents() {
      slider.slides.forEach((slide, idx) => {
        slide.addEventListener('click', () => {
          if (mainRef.current) mainRef.current.moveToIdx(idx);
        });
      });
    }

    slider.on('created', () => {
      if (!mainRef.current) return;
      addActive(slider.track.details.rel);
      addClickEvents();
      mainRef.current.on('animationStarted', (main) => {
        removeActive();
        const next = main.animator.targetIdx ?? 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(Math.min(slider.track.details.maxIdx, next));
      });
    });
  };
}

export default function HomePage({
  events,
  businesses,
  workshops,
}: {
  events: Event[];
  businesses: Business[];
  workshops: Workshop[];
}) {
  console.log('events', events);
  const [visibleBusinesses, setVisibleBusinesses] = useState<Business[]>([]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  });
  const [thumbnailRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slides: {
        perView: 8,
        spacing: 20,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );
  const IMAGE_WIDTH = 800;
  const IMAGE_HEIGHT = 408; // 52 * 4 (Tailwind h-52 = 13rem = 208px)
  useEffect(() => {
    if (businesses.length === 0) return;

    setVisibleBusinesses(businesses.slice(0, 4)); // Initial 4

    const interval = setInterval(() => {
      setVisibleBusinesses((prev) => {
        const [first, ...rest] = prev;
        const currentIndex = businesses.findIndex((b) => b.id === first.id);
        const nextIndex = (currentIndex + 4) % businesses.length;
        const nextBusiness = businesses[nextIndex];
        return [...rest, nextBusiness];
      });
    }, 4000); // every 4s

    return () => clearInterval(interval);
  }, [businesses]);
  return (
    <>
      <div ref={sliderRef} className='keen-slider mb-4'>
        {events.map((event, idx) => (
          <div key={idx} className='keen-slider__slide relative'>
            <Image
              src={event.bannerUrls?.sizes?.medium || '/placeholder.png'}
              alt={event.title}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className='object-cover w-full rounded-lg'
              style={{ height: `${IMAGE_HEIGHT}px` }}
            />

            {/* Bottom Overlay */}
            <div className='absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-lg z-30'>
              <div className='flex items-end justify-between'>
                <div>
                  <p className='font-bold text-2xl text-white leading-tight drop-shadow-lg'>
                    {event.title}
                  </p>
                  <p className='text-sm text-gray-200 mt-1'>{event.date}</p>
                </div>

                {/* ✅ Ensure button is above everything */}
                <Button
                  asChild
                  className='z-40 bg-white/20 hover:bg-white/30 text-white border border-white/10 px-6 py-2 rounded-lg'
                >
                  <Link href={`/events/${event.id}`}>View Event</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <section className='relative z-10 mb-8'>
        <SectionHeader header='Events' linkPath='events' />
        <div ref={thumbnailRef} className='keen-slider thumbnail gap-2'>
          {events.map((event, idx) => (
            <div
              key={idx}
              className='keen-slider__slide w-[180px] min-w-[180px] max-w-[180px] rounded-xl overflow-hidden flex flex-col border border-border shadow bg-white/10 backdrop-blur-sm'
              style={{ boxShadow }}
            >
              {/* Banner with golden ratio */}
              <div className='relative w-full aspect-[1.618]'>
                <Image
                  src={event.bannerUrls?.sizes?.small || '/placeholder.png'}
                  alt={event.title}
                  fill
                  className='object-cover'
                />
              </div>

              {/* Title section */}
              <div className='p-2'>
                <p className='text-sm font-medium line-clamp-2 leading-tight'>
                  {event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className='relative z-10 mb-8'>
        <SectionHeader header='Businesses' linkPath='businesses' />
        <BusinessesSlides businesses={businesses} />
      </section>
      <div className='flex flex-col lg:flex-row gap-6 mt-6 mx-2'>
        {/* Left column - Workshops + Swiper */}
        <div className='w-full lg:w-1/2'>
          <SectionHeader header='Workshops' linkPath='workshops' />
          <SwiperDeckOfCards workshops={workshops} />
        </div>

        {/* Right column - Join Us card */}
        <div className='w-full lg:w-1/2'>
          <Card className='h-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300'>
            <CardContent className='p-4 h-full flex flex-col items-center justify-center text-center'>
              <h3 className='text-lg font-semibold mb-2'>Join Us</h3>
              <p className='text-sm text-gray-300 mb-4'>
                Become part of our vibrant community and connect with others!
              </p>
              <Button
                asChild
                className='bg-primary text-white hover:bg-primary/90'
              >
                <Link href='/join'>Join Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
