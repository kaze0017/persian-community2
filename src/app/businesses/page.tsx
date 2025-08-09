'use client';

import React, { useEffect, useMemo, useState } from 'react';
import ListHeader from '@/components/ListHeader';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBusinesses } from '@/app/lib/businessesSlice';
import { useRouter } from 'next/navigation';
import BusinessCard from './components/BusinessCard';
import Link from 'next/link';
import MinimalistGlassmorphic from '../components/businesses/MinimalistGlassmorphic';

export default function Page() {
  const dispatch = useAppDispatch();
  const { items: businesses, loading } = useAppSelector(
    (state) => state.businesses
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Fetch businesses on first render
  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  // Extract unique categories from businesses
  const categories = useMemo(() => {
    const cats = new Set<string>();
    businesses.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return Array.from(cats);
  }, [businesses]);

  return (
    // <div className='max-w-4xl mx-auto p-6 space-y-8'>
    // <h1 className='text-2xl font-bold mb-4'>Business Selector</h1>
    <>
      <ListHeader
        showAdd={false}
        addLabel='Add Business'
        onAdd={() => router.push('/admin/add-business')}
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder='Search businesses...'
        filterValue={selectedCategory}
        onFilterChange={setSelectedCategory}
        filterOptions={categories}
        showFilter
        showRefresh
        onRefresh={() => dispatch(fetchBusinesses())}
        disabled={loading}
      />
      {loading ? (
        <div className='p-4'>Loading businesses...</div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {businesses
            .filter((biz) => {
              const matchesCategory =
                selectedCategory === 'All' || biz.category === selectedCategory;
              const matchesSearch = `${biz.businessName} ${biz.ownerName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            })
            .map((business) => (
              <Link href={`/businesses/${business.id}`} key={business.id}>
                {/* <BusinessCard business={business} /> */}
                <MinimalistGlassmorphic business={business} />
              </Link>
            ))}
        </div>
      )}
    </>
    // </div>
  );
}
