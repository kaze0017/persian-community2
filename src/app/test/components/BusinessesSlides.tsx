'use client';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // ✅ import autoplay styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'; // ✅ add Autoplay
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CardContent } from '@/components/ui/card';
import { Business } from '@/types/business';
import clsx from 'clsx';
import { filter, boxShadow } from '@/app/components/filters/logoFilter';

export default function BusinessesSlides({
  businesses,
}: {
  businesses: Business[];
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section className='flex flex-col items-center gap-4 py-8 '>
      <Swiper
        spaceBetween={16}
        centeredSlides
        slidesPerView={1}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className='w-full h-full overflow-visible px-4'
        loop
        autoplay={{
          delay: 3000, // ⏱️ 3 seconds
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]} // ✅ include Autoplay
      >
        {businesses.map((biz, idx) => (
          <SwiperSlide
            key={biz.id}
            className={clsx(
              'transition-transform duration-300',
              idx === activeIndex
                ? 'scale-110 z-20'
                : 'scale-90 opacity-80 z-10'
            )}
          >
            <BusinessCard business={biz} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

type BusinessCardProps = {
  business?: Business;
  section?: 'user' | 'client' | 'admin';
};
export const BusinessCard = ({
  business,
  section = 'user',
}: BusinessCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (!business?.id) {
      router.push('/client/businesses/create');
      return;
    }

    const paths: Record<string, string> = {
      user: `/businesses/${business.id}`,
      client: `/client/businesses/${business.id}`,
      admin: `/admin/businesses/${business.id}`,
    };

    if (section && paths[section]) {
      router.push(paths[section]);
    }
  };

  return (
    <CardContent
      onClick={handleClick}
      className='p-4 h-32 backdrop-blur-3xl rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/10 flex items-center cursor-pointer'
      style={{ boxShadow }}
    >
      <div className='flex items-center gap-4 w-full'>
        <Image
          src={
            business
              ? business.logoUrl || '/placeholder.png'
              : '/images/plus.webp'
          }
          alt={business ? business.businessName : 'Add Business'}
          width={64}
          height={64}
          style={{ filter }}
          className='w-16 h-16 rounded-full object-cover'
        />
        <div>
          {business && (
            <>
              <h3 className='text-lg font-semibold'>{business.businessName}</h3>
              <p className='text-sm text-gray-300 line-clamp-3'>
                {business.businessConfig?.aboutConfig?.description ||
                  'No description available'}
              </p>
            </>
          )}
          {!business && <h3 className='text-lg font-semibold'>Add New</h3>}
        </div>
      </div>
    </CardContent>
  );
};
