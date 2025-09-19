'use client';
import React, { useCallback } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Person } from '@/types/person';
import { Business } from '@/types/business';
import { BusinessCard } from '@/app/test/components/BusinessesSlides';

export default function page() {
  const user = useAppSelector((state) => state.user);
  const allBusinesses = useAppSelector((state) => state.businesses.items);
  console.log('allBusinesses', allBusinesses);
  const userBusinesses: Business[] = useCallback(() => {
    if (!user || !user.businesses) return [];
    return allBusinesses.filter((b) => user.businesses?.includes(b.id));
  }, [user, allBusinesses])();
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      <BusinessCard />
      {userBusinesses.map((b) => (
        <BusinessCard key={b.id} business={b} section='client' />
      ))}
    </div>
  );
}
