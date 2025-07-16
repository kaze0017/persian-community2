'use client';

import React from 'react';

type ProductItem = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  options?: string;
  featured?: boolean;
  available?: boolean;
};

type Props = {
  product: ProductItem;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className='flex max-w-xl border rounded-md p-4 gap-4 shadow-sm'>
      {/* Image */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className='w-24 h-24 object-cover rounded'
        />
      ) : (
        <div className='w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400'>
          No Image
        </div>
      )}

      {/* Details */}
      <div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2'>
        <div>
          <h4 className='font-semibold text-lg'>{product.name}</h4>
          {product.description && (
            <p className='text-sm text-muted-foreground'>
              {product.description}
            </p>
          )}
        </div>

        <div>
          <p>
            <strong>Price:</strong>{' '}
            {typeof product.price === 'number'
              ? `$${product.price.toFixed(2)}`
              : 'N/A'}
          </p>
          {product.options && (
            <p>
              <strong>Options:</strong> {product.options}
            </p>
          )}
          <p className='flex items-center gap-1'>
            <strong>Featured:</strong>{' '}
            {product.featured ? (
              <CheckIcon className='w-5 h-5 text-green-600' />
            ) : (
              <CrossIcon className='w-5 h-5 text-red-600' />
            )}
          </p>
          <p className='flex items-center gap-1'>
            <strong>Available:</strong>{' '}
            {product.available ? (
              <CheckIcon className='w-5 h-5 text-green-600' />
            ) : (
              <CrossIcon className='w-5 h-5 text-red-600' />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={3}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  );
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={3}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  );
}
