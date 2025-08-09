import React from 'react';
import './businessCard.css';
export default function GlassmorphicBusinessCards() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex items-center justify-center p-8 gap-6'>
      {/* Container for cards */}
      <div className='flex flex-col gap-6'>
        {/* Front card */}
        <div className='glass-card hover:rotate-3 transition-transform duration-500 ease-in-out cursor-pointer'>
          <div className='text-2xl font-semibold text-cyan-400 mb-1'>
            Jonathan Doe
          </div>
          <div className='text-sm text-gray-300 mb-4'>Job Title</div>
          <ul className='space-y-2 text-gray-200 text-sm'>
            <li className='flex items-center gap-2'>
              <PhoneIcon />
              +00 1234 5678
            </li>
            <li className='flex items-center gap-2'>
              <MailIcon />
              email@cxample.com
            </li>
            <li className='flex items-center gap-2'>
              <LocationIcon />
              1234 Elm Street, City, State
            </li>
          </ul>
        </div>

        {/* Back card */}
        <div className='glass-card hover:-rotate-3 transition-transform duration-500 ease-in-out cursor-pointer flex items-center justify-center gap-4'>
          <div className='text-cyan-400 text-4xl font-bold border-2 border-cyan-400 rounded-full w-14 h-14 flex items-center justify-center'>
            C
          </div>
          <div className='text-white'>
            <div className='text-xl font-bold'>COMPANY NAME</div>
            <div className='text-xs mt-1 tracking-widest opacity-70'>
              TAGLINE HERE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons as inline SVG for simplicity
function PhoneIcon() {
  return (
    <svg
      className='w-4 h-4 text-lime-400'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      viewBox='0 0 24 24'
    >
      <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 13 13 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 13 13 0 0 0 2.81.7 2 2 0 0 1 1.72 2z' />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      className='w-4 h-4 text-lime-400'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      viewBox='0 0 24 24'
    >
      <path d='M4 4h16v16H4z' />
      <polyline points='22,6 12,13 2,6' />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className='w-4 h-4 text-lime-400'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      viewBox='0 0 24 24'
    >
      <path d='M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z' />
      <circle cx='12' cy='10' r='3' />
    </svg>
  );
}
