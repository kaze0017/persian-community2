'use client';

import Image from 'next/image';
import { BusinessService } from '@/types/business';
import { Trash2 } from 'lucide-react';
import { filter } from '@/app/components/filters/logoFilter';

interface ServiceCardProps {
  service: BusinessService;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function ServiceCard({
  service,
  isAdmin = true,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className='relative flex flex-col items-center text-center gap-0.5 px-2 py-3'>
      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(service.id)}
          className='absolute top-1 right-1 text-muted-foreground hover:text-destructive'
          aria-label='Delete service'
        >
          <Trash2 size={16} />
        </button>
      )}

      {(service.imageUrl || service.iconUrl) && (
        // <div className='w-30 h-30 mb-1 relative  overflow-hidden'>
        <div className='w-32 h-32 flex items-center justify-center'>
          <Image
            src={service.imageUrl || service.iconUrl!}
            alt={service.name}
            width={128}
            height={128}
            className='object-contain'
            style={{ filter }}
          />
        </div>
      )}

      <h3 className='text-base font-semibold leading-tight'>{service.name}</h3>

      {service.description && (
        <p className='text-xs whitespace-pre-line leading-snug mt-0.5'>
          {service.description}
        </p>
      )}

      {service.price !== undefined && (
        <p className='text-sm font-medium mt-1 leading-none'>
          Price: ${service.price}
        </p>
      )}

      {service.duration !== undefined && (
        <p className='text-xs text-gray-500 leading-none'>
          Duration: {service.duration} min
        </p>
      )}

      {service.isAvailable === false && (
        <p className='text-xs text-red-600 font-semibold mt-1 leading-none'>
          Unavailable
        </p>
      )}
    </div>
  );
}
