'use client';
import 'keen-slider/keen-slider.min.css';

export default function EventCarouselSkeleton() {
  const fakeItems = Array.from({ length: 3 }); // 3 placeholder slides

  return (
    <div className='w-full space-y-6 animate-pulse'>
      {/* Main Carousel Skeleton */}
      <div className='keen-slider w-full rounded-xl overflow-hidden'>
        {fakeItems.map((_, idx) => (
          <div key={idx} className='keen-slider__slide relative bg-gray-200'>
            <div className='relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[5/2] bg-gray-300' />
          </div>
        ))}
      </div>

      {/* Header & Strip Skeleton */}
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <div className='h-5 w-24 bg-gray-300 rounded' />
          <div className='h-4 w-16 bg-gray-200 rounded' />
        </div>

        <div className='flex overflow-x-auto gap-4 pb-1'>
          {fakeItems.map((_, idx) => (
            <div
              key={idx}
              className='flex-none w-[100px] sm:w-[120px] rounded-md overflow-hidden border border-gray-200'
            >
              <div className='relative w-full aspect-[16/9] bg-gray-300' />
              <div className='h-3 w-full bg-gray-200' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
