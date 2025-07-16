'use client';

import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { RestaurantProduct } from '@/types/RestaurantProduct';

import FeaturedCard from './FeaturedCard';

// type Item = {
//   id: string;
//   name: string;
//   description?: string;
//   price?: number;
//   imageUrl?: string;
//   categoryId?: string;
// };

type Props = {
  // featuredItems: Item[];
  featuredItems: RestaurantProduct[];
};

export default function FeaturedSection({ featuredItems }: Props) {
  if (!featuredItems.length) return null;

  return (
    <section className='mb-10'>
      <div className='flex items-center gap-2 mb-6'>
        <Star className='w-6 h-6 text-yellow-500' />
        <h2 className='text-2xl font-bold'>Featured Items</h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        autoplay={{ delay: 5000 }}
        loop
        className='pb-8'
      >
        {featuredItems.map((item) => (
          <SwiperSlide key={item.id} style={{ width: '256px' }}>
            <FeaturedCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
