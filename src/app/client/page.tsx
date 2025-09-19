import React from 'react';
import BoxButton from './_components/BoxButton';
import { url } from 'inspector';
const icons = [
  { id: 1, name: 'event', src: '/images/calender.webp', url: '/client/events' },
  {
    id: 2,
    name: 'workshop',
    src: '/images/class.webp',
    url: '/client/workshops',
  },
  {
    id: 3,
    name: 'business',
    src: '/images/office.webp',
    url: '/client/businesses',
  },
];
export default function Page() {
  return (
    //grid md 3 columns sm 1 columns
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full justify-center items-center p-4'>
      {icons.map((icon) => (
        <BoxButton
          key={icon.id}
          src={icon.src}
          alt={icon.name}
          url={icon.url}
        />
      ))}
    </div>
  );
}
