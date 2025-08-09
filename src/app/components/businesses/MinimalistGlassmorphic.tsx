import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, Globe } from 'lucide-react';
import Image from 'next/image';
import { Business } from '@/types/business';

export default function MinimalistGlassmorphic({
  business,
}: {
  business: Business;
}) {
  const color = '#06b6d4'; // Cyan color for the filter effect
  const filter = `
    drop-shadow(0 0 10px ${color})
    brightness(0)
    saturate(100%)
    invert(60%)
    sepia(100%)
    hue-rotate(180deg)
  `;
  const boxShadow = `
    inset -20px 20px 30px 0px #A5BBE432,
    inset -10px 10px 20px 0px #A5BBE426,
    inset -5px 5px 15px 0px #A5BBE408
  `;

  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className='w-[300px] h-[180px] perspective'
      style={{ perspective: 1000 }}
    >
      <div
        className='relative w-full h-full duration-700'
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        {/* Front Side */}
        <Card
          className='flip-card-front absolute w-full h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg flex items-center p-4 gap-x-4'
          style={{ boxShadow, backfaceVisibility: 'hidden' }}
        >
          <div className='grid grid-cols-[25%_75%] gap-4 w-full h-full align-middle'>
            <Image
              src={business.logoUrl || '/logo2.png'}
              alt={business.businessName || 'Business Logo'}
              width={100}
              height={100}
              style={{ filter }}
              className='rounded-full object-cover m-auto'
            />
            <CardContent className='flex flex-col justify-center text-left'>
              <h2 className='text-xl font-semibold text-white'>
                {business.ownerName || 'JOHN DOE'}
              </h2>
              <p className='text-gray-300 text-sm'>{business.businessName}</p>
            </CardContent>
          </div>
        </Card>

        {/* Back Side */}
        <Card
          className='flip-card-back absolute w-full h-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg p-6 text-white'
          style={{
            boxShadow,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className='flex flex-col gap-2 w-full h-full align-middle pl-12'>
            <div className='w-full h-full flex flex-col'>
              <h2 className='text-lg font-semibold'>
                {business.ownerName || 'JOHN DOE'}
              </h2>
              <p className='text-gray-300'>
                {business.businessName || 'Graphic Designer'}
              </p>
            </div>
            <div className='flex flex-col gap-2 text-sm w-full align-middle'>
              <div className='flex items-center gap-2'>
                <Phone size={14} className='text-cyan-400' style={{ filter }} />
                {business.phone || '+123 456 7890'}
              </div>
              <div className='flex items-center gap-2'>
                <Mail size={14} className='text-cyan-400' style={{ filter }} />
                {business.email || 'john.doe@example.com'}
              </div>
              <div className='flex items-center gap-2'>
                <Globe size={14} className='text-cyan-400' style={{ filter }} />
                <span className='truncate max-w-[150px] block'>
                  {business.address || 'www.example.com'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
