'use client';

import Image from 'next/image';
import { Business } from '@/types/business';
import OptimizedBanner from '@/app/components/OptimizedBanner';

interface props {
  // businessId: string;
  business: Business;
}

// export default function RestaurantHeader({ businessId, business }: props) {
export default function RestaurantHeader({ business }: props) {
  return (
    <>
      {/* Banner */}
      <div className='relative w-full h-52 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-700 mb-6'>
        <OptimizedBanner
          banner={business?.bannerImageUrls}
          alt='Restaurant Banner'
        />

        {/*           
        <Image
          src={business?.bannerImageUrl || '/default-banner.jpg'}
          alt='Restaurant Banner'
          fill
          className='object-cover'
          sizes='100vw'
          priority
          quality={90}
        /> */}
      </div>

      {/* Logo and Info */}
      <section className='flex items-center gap-6 mb-8'>
        <div className='w-24 h-24 rounded-full overflow-hidden flex items-center justify-center'>
          <Image
            src={business?.logoUrl || '/default-logo.png'}
            alt='Restaurant Logo'
            width={96}
            height={96}
          />
        </div>
        <div>
          <h1 className='text-3xl font-bold'>
            {business?.businessName || 'Restaurant Name'}
          </h1>
          <p className='text-muted-foreground'>{business.address}</p>
        </div>
      </section>
    </>
  );
}
