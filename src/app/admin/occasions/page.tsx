'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchOccasions, addOccasion } from '@/app/lib/occasionsSlice';
import AddOccasionCard from './components/AddOccasionCard';
import OccasionCard from './components/OccasionCard';
import { Occasion } from '@/types/occasions';
import ListHeader from '@/components/ListHeader';

export default function OccasionsPage() {
  const dispatch = useAppDispatch();
  const { occasions, loading, error } = useAppSelector(
    (state) => state.occasions
  );

  // State for search input
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchOccasions());
  }, [dispatch]);

  // Accepts an occasion without 'id', adds it via redux
  const handleAddOccasion = (occasion: Omit<Occasion, 'id'>) => {
    dispatch(addOccasion(occasion));
  };

  // Filter occasions by search query (case insensitive)
  const filteredOccasions = occasions.filter((occasion) =>
    occasion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='max-w-5xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Manage Occasions</h1>
      <ListHeader
        addLabel=''
        showAdd={false}
        search={searchQuery}
        onSearchChange={(val: string) => {
          setSearchQuery(val);
        }}
        searchPlaceholder='Search...'
        showSearch={true}
        filterOptions={[]}
        showFilter={false}
        onRefresh={() => {
          dispatch(fetchOccasions());
        }}
        showRefresh={true}
        disabled={false}
      />

      {loading && <p>Loading occasions...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <AddOccasionCard onAdd={handleAddOccasion} />
        {[...filteredOccasions]
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((occasion) => (
            <OccasionCard key={occasion.id} occasion={occasion} />
          ))}
      </div>
    </div>
  );
}
