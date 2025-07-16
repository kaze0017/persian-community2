'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Business } from '@/types/business';
import QRCode from 'react-qr-code';

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

  const businessUrl = `http://localhost:3000/businesses/${id}`;

  return (
    <div
      className={`relative w-[350px] h-[200px] text-white ${cardBg} rounded-lg shadow-lg flex overflow-hidden`}
    >
      {/* Left section */}
      <div className='w-1/3 bg-[#1b263b] flex items-center justify-center p-4'>
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={`${businessName} logo`}
            width={64}
            height={64}
            className='object-contain'
          />
        )}
      </div>

      {/* Right section */}
      <div className='w-2/3 p-4 flex flex-col'>
        {/* Owner info */}
        <div className='flex items-center gap-2'>
          {ownerImageUrl && (
            <Image
              src={ownerImageUrl}
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

        {/* Contact info (10px below header) */}
        <div className='text-xs space-y-1 mt-[10px]'>
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
      </div>

      {/* Absolute Website and QR */}
      <div className='absolute bottom-2 right-2 flex items-center gap-12  px-2 py-1 rounded shadow'>
        <p className='text-xs text-[#8ecae6] max-w-[100px] '>
          www.yourwebsite.com
        </p>
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
  );
}
