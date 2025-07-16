'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

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

type ProductsByType = Record<string, { items: ProductItem[] }>;

type Props = {
  productsByType: ProductsByType;
  loading: boolean;
  onAddProduct: (type: string) => void;
  onDeleteType: (type: string) => void;
};

export default function ProductTypeList({
  productsByType,
  loading,
  onAddProduct,
  onDeleteType,
}: Props) {
  const [openTypes, setOpenTypes] = useState<Record<string, boolean>>({});

  if (loading) return <p>Loading products...</p>;

  if (!productsByType || Object.keys(productsByType).length === 0)
    return <p>No product types found.</p>;

  const toggleType = (type: string) => {
    setOpenTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className='space-y-8'>
      {Object.entries(productsByType).map(([type, { items }]) => {
        const isOpen = openTypes[type] ?? false; // default CLOSED

        return (
          <section key={type} className='border rounded-md p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold capitalize'>{type}</h3>
              <div className='flex gap-2 items-center'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => onAddProduct(type)}
                >
                  Add Product
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => onDeleteType(type)}
                >
                  Delete Type
                </Button>
                <button
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  onClick={() => toggleType(type)}
                  className='ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700'
                >
                  {isOpen ? (
                    <ChevronUpIcon className='w-5 h-5' />
                  ) : (
                    <ChevronDownIcon className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {isOpen ? (
              items.length === 0 ? (
                <p className='text-muted-foreground'>
                  No products in this type.
                </p>
              ) : (
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <Button variant='secondary' onClick={() => toggleType(type)}>
                Show Products ({items.length})
              </Button>
            )}
          </section>
        );
      })}
    </div>
  );
}

// Icons for expand/collapse
function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2.5}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polyline points='18 15 12 9 6 15' />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2.5}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polyline points='6 9 12 15 18 9' />
    </svg>
  );
}
