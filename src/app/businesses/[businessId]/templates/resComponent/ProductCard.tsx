'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

import type { RestaurantProduct } from '@/types/RestaurantProduct';
import { cardClass, boxShadow } from '@/app/components/filters/logoFilter';

type Props = {
  item: RestaurantProduct;
  onClick?: () => void;
};

export default function ProductCard({ item, onClick }: Props) {
  return (
    // <div className='max-w-80 max-h-40'>
    <Card
      onClick={onClick}
      // className='cursor-pointer hover:shadow-md transition-shadow w-full max-w-xl'
      className={`${cardClass} w-full h-full`}
      style={{ boxShadow }}
    >
      <CardContent className='p-4 flex gap-4'>
        <div className='w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden relative shrink-0'>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-muted-foreground text-sm'>
              No Image
            </div>
          )}
        </div>

        <div className='flex-1'>
          <h4 className='font-semibold text-lg line-clamp-1'>{item.name}</h4>
          {item.description && (
            <p className='text-sm text-muted-foreground line-clamp-2'>
              {item.description}
            </p>
          )}
          {typeof item.price === 'number' && (
            <p className='mt-2 font-semibold'>${item.price.toFixed(2)}</p>
          )}
        </div>
      </CardContent>
    </Card>
    // </div>
  );
}
