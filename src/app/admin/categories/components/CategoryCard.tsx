'use client';

import { Category } from '@/types/category';
import {
  Utensils,
  Building,
  Wrench,
  Palette,
  Hammer,
  Scissors,
  MoreHorizontal,
  Gavel,
  Monitor,
} from 'lucide-react';
import type { JSX } from 'react';

const iconMap: Record<string, () => JSX.Element> = {
  Utensils: () => (
    <Utensils className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
  Building: () => (
    <Building className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
  Wrench: () => <Wrench className='w-6 h-6 text-gray-900 dark:text-gray-100' />,
  Art: () => <Palette className='w-6 h-6 text-gray-900 dark:text-gray-100' />,
  Mechanic: () => (
    <Hammer className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
  Barber: () => (
    <Scissors className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
  Other: () => (
    <MoreHorizontal className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
  Lawyer: () => <Gavel className='w-6 h-6 text-gray-900 dark:text-gray-100' />,
  'Computer/IT': () => (
    <Monitor className='w-6 h-6 text-gray-900 dark:text-gray-100' />
  ),
};

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <div className='flex items-center gap-4 rounded-md p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-20'>
      <div className='p-2 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center w-10 h-10'>
        {(
          iconMap[category.icon] ??
          (() => (
            <Utensils className='w-6 h-6 text-gray-900 dark:text-gray-100' />
          ))
        )()}
      </div>
      <p className='text-gray-900 dark:text-gray-100 text-lg font-medium'>
        {category.name}
      </p>
    </div>
  );
}
