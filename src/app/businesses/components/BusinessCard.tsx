'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Business } from '@/types/business';
import QRCode from 'react-qr-code';
import { useMediaQuery } from '@/app/utils/useMediaQuery';

type Props = {
  business: Business;
};

export default function BusinessCard({ business }: Props) {
  const {
    businessName,
    ownerName,
    phone,
    email,
    address,
    logoUrl,
    ownerImageUrl,
    id,
  } = business;

  const cardBg = 'bg-[#0d1b2a]'; // dark navy
  const accentColor = 'text-[#00aaff]'; // bright blue

  const businessUrl = `https://yourdomain.com/businesses/${id}`;
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  //  QR + Website  style
  const webQrStyle = isLargeScreen
    ? `flex items-center justify-between mt-2 absolute bottom-4 left-4 right-4`
    : `flex items-end justify-between mt-2 absolute bottom-2 left-0 right-2`;

  return (
    <div
      className={`relative text-white ${cardBg} rounded-lg shadow-lg flex overflow-hidden 
        w-full h-auto 
        lg:w-[350px] lg:h-[200px]`}
    >
      {/* Left: Logo */}
      <div className='w-1/3 bg-[#1b263b] flex items-center justify-center p-4'>
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${businessName} logo`}
            width={64}
            height={64}
            className='object-contain max-h-[64px]'
          />
        ) : (
          <div className='text-xs text-gray-400 text-center'>No Logo</div>
        )}
      </div>

      {/* Right: Details */}
      <div className='w-2/3 p-4 pb-6 flex flex-col gap-3 relative'>
        {/* Owner Info */}
        <div className='flex items-center gap-2 max-h-[60px] overflow-hidden'>
          {ownerImageUrl && (
            <Image
              src={ownerImageUrl || '/default-avatar.webp'}
              alt={`${ownerName} photo`}
              width={32}
              height={32}
              className='rounded-full object-cover border'
            />
          )}
          <div>
            <h2 className={`text-lg font-bold uppercase ${accentColor}`}>
              {ownerName}
            </h2>
            <p className='text-sm'>{businessName}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className='text-xs space-y-1 mt-2'>
          {address && (
            <p className='flex items-start gap-1'>
              <MapPin className='w-3 h-3 mt-0.5 shrink-0' />
              <span className='whitespace-pre-wrap'>{address}</span>
            </p>
          )}
          {phone && (
            <p className='flex items-center gap-1'>
              <Phone className='w-3 h-3' /> {phone}
            </p>
          )}
          {email && (
            <p className='flex items-center gap-1'>
              <Mail className='w-3 h-3' /> {email}
            </p>
          )}
        </div>

        {/* QR + Website */}
        <div className={webQrStyle}>
          <p className='text-xs text-[#8ecae6] truncate'>www.yourwebsite.com</p>
          <div className='w-8 h-8 shrink-0'>
            <QRCode
              value={businessUrl}
              size={32}
              bgColor='#0d1b2a'
              fgColor='#ffffff'
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
