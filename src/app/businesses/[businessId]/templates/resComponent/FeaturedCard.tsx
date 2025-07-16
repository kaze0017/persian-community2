'use client';

import Image from 'next/image';

type Props = {
  item: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    imageUrl?: string;
  };
};

export default function FeaturedCard({ item }: Props) {
  return (
    <div className='w-64 h-[360px] border rounded-lg p-4 shadow hover:shadow-lg transition-shadow cursor-pointer flex flex-col bg-background'>
      <div className='w-full h-40 rounded overflow-hidden relative mb-4 bg-gray-100 dark:bg-gray-700'>
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-muted'>
            No Image
          </div>
        )}
      </div>

      <h3 className='font-semibold text-lg line-clamp-1'>{item.name}</h3>

      {item.description && (
        <p className='text-sm text-muted-foreground line-clamp-3 flex-grow'>
          {item.description}
        </p>
      )}

      {typeof item.price === 'number' && (
        <p className='mt-2 font-semibold'>{`$${item.price.toFixed(2)}`}</p>
      )}
    </div>
  );
}
