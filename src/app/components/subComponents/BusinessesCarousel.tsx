'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import { useEffect, useRef, memo } from 'react';
import { Business } from '@/types/business';
import Link from 'next/link';

interface Props {
  businesses: Business[];
  imageOnLeft?: boolean;
}

export default function BusinessesCarousel({
  businesses,
  imageOnLeft = true,
}: Props) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [ref, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  // ✅ Start autoplay only if more than 1 slide
  useEffect(() => {
    if (slider.current && businesses.length > 1) {
      timerRef.current = setInterval(() => {
        slider.current?.next();
      }, 8000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slider, businesses.length]);

  return (
    <div ref={ref} className='keen-slider w-full rounded-xl overflow-hidden'>
      {businesses.map((business, idx) => {
        const banner = business.bannerImageUrls;
        const imageSrc =
          banner?.sizes.medium || banner?.sizes.small || '/default-banner.jpg';

        return (
          <div
            key={business.id}
            className='keen-slider__slide shadow-md rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2'
          >
            {imageOnLeft ? (
              <>
                <div className='relative w-full h-64 md:h-[400px]'>
                  <Image
                    src={imageSrc}
                    alt={business.businessName}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
                <MemoBusinessInfo business={business} />
              </>
            ) : (
              <>
                <MemoBusinessInfo business={business} />
                <div className='relative w-full h-64 md:h-[400px]'>
                  <Image
                    src={imageSrc}
                    alt={business.businessName}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ✅ Memoized to prevent unnecessary re-renders
const BusinessInfo = ({ business }: { business: Business }) => {
  return (
    <div className='p-6 flex flex-col justify-center gap-4'>
      <div className='flex items-center gap-4'>
        {business.ownerImageUrl && (
          <Image
            src={business.ownerImageUrl}
            alt={business.ownerName}
            width={48}
            height={48}
            className='rounded-full object-cover'
            loading='lazy'
          />
        )}
        <h3 className='text-lg font-semibold'>{business.ownerName}</h3>
      </div>

      {business.businessConfig?.aboutConfig?.description && (
        <div className='text-sm whitespace-pre-line'>
          <p>{business.businessConfig.aboutConfig.description}</p>
        </div>
      )}
      <Link
        href={`/businesses/${business.id}`}
        className='mt-2 inline-block text-primary hover:underline font-semibold'
      >
        Check Us Out →
      </Link>
    </div>
  );
};

const MemoBusinessInfo = memo(BusinessInfo);
