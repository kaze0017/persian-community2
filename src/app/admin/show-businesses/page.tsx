'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinesses } from '@/app/lib/businessesSlice';
import { RootState, AppDispatch } from '@/app/lib/store';
import BusinessCard from '@/app/businesses/components/BusinessCard';
import { Business } from '@/types/business';
import ListHeader from '@/components/ListHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ShowBusinessesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    items: businesses,
    loading,
    error,
  } = useSelector((state: RootState) => state.businesses);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    businesses.forEach((b) => {
      if (b.category) cats.add(b.category);
    });
    return Array.from(cats);
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const byCategory =
      selectedCategory === 'All'
        ? businesses
        : businesses.filter((biz) => biz.category === selectedCategory);

    return byCategory.filter((biz) =>
      `${biz.businessName} ${biz.ownerName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [businesses, selectedCategory, searchQuery]);

  return (
    <div className='mx-auto p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Businesses</h1>
      </div>

      {/* Filters */}

      <ListHeader
        showAdd={true}
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

      {/* Business Cards */}
      {loading ? (
        <p className='p-6'>Loading businesses...</p>
      ) : filteredBusinesses.length === 0 ? (
        <p className='p-6'>No businesses found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {filteredBusinesses.map((biz: Business) => (
            <Link
              href={`editBusiness/${biz.id}`}
              key={biz.id}
              className='no-underline'
            >
              <BusinessCard key={biz.id} business={biz} />
            </Link>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className='text-red-500 mt-4'>Error loading businesses: {error}</p>
      )}
    </div>
  );
}
