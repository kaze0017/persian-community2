'use client';

import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { ChevronRight, ChevronLeft, Link } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay, Navigation } from 'swiper/modules';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CardContent } from '@/components/ui/card';
import { Workshop } from '@/types/workshop';
import { Button } from '@/components/ui/button';

export default function SwiperDeckOfCards({
  workshops,
}: {
  workshops: Workshop[];
}) {
  const router = useRouter();

  // 🔧 Refs for navigation buttons
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className='relative flex flex-col items-center gap-4 py-8'>
      {/* Swiper */}
      <Swiper
        direction='vertical'
        effect='cards'
        grabCursor={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== 'boolean'
          ) {
            swiper.params.navigation.prevEl = prevRef.current!;
            swiper.params.navigation.nextEl = nextRef.current!;
          }
        }}
        modules={[EffectCards, Autoplay, Navigation]}
        className='w-80 h-[518px]'
      >
        {workshops.map((workshop) => (
          <SwiperSlide
            key={workshop.id}
            className='cursor-pointer'
            onClick={() => router.push(`/workshop/${workshop.id}`)}
          >
            <WorkshopCard workshop={workshop} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons (must render after Swiper but exist before init) */}
      <div
        ref={prevRef}
        className='swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer select-none
       bg-white/10 backdrop-blur-md  rounded-full shadow-lg hover:bg-white/20 transition'
      >
        <ChevronLeft className='text-white w-16 h-16' />
      </div>

      <div
        ref={nextRef}
        className='swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer select-none
       bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition  text-4xl'
      >
        {/* Increase size of the icon */}

        <ChevronRight className='text-white w-16 h-16 text-4xl' />
      </div>
    </section>
  );
}

const WorkshopCard = ({ workshop }: { workshop: Workshop }) => {
  return (
    <CardContent className='w-80 h-[518px] p-0 rounded-3xl overflow-hidden shadow-lg bg-zinc-600 backdrop-blur-3xl transition-shadow duration-300'>
      <div className='flex flex-col h-full'>
        <Image
          src={workshop.bannerUrl || '/placeholder.png'}
          alt={workshop.title}
          width={320}
          height={200}
          className='w-full h-48 object-cover'
        />
        <div className='p-4 flex flex-col gap-2 flex-1'>
          <h3 className='text-xl font-semibold mb-2'>{workshop.title}</h3>
          <p className='text-sm text-gray-300 line-clamp-4'>
            {workshop.description || 'No description available'}
          </p>
          <p className='text-sm text-gray-400'>{workshop.startDate}</p>
          <p className='text-sm text-gray-400'>{workshop.instructor.name}</p>
        </div>
        <div className='p-4'>
          <Button asChild className='bg-primary  hover:bg-primary/90 w-full'>
            <Link href={`/workshop/${workshop.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  );
};
