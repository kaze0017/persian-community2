'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '@/app/lib/store';
import { fetchBusinesses } from '@/app/lib/businessesSlice';
import BusinessesCarousel from './subComponents/BusinessesCarousel';
import Link from 'next/link';

export default function NewBusinessesSection() {
  const dispatch = useAppDispatch();

  const { items: businesses, loading } = useAppSelector(
    (state: RootState) => state.businesses
  );

  const sponsored = businesses.filter((b) => b.isSponsored);

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>New in Ottawa</h2>
        <Link
          href='/businesses'
          className='text-sm font-medium text-blue-600 hover:underline'
        >
          View All Businesses
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sponsored.length === 0 ? (
        <p className='text-gray-500'>No sponsored businesses available.</p>
      ) : (
        <BusinessesCarousel businesses={sponsored} imageOnLeft={false} />
      )}
    </div>
  );
}
