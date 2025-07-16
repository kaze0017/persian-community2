'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import EventCard from './components/EventCard';
import ListHeader from '@/components/ListHeader';
import { fetchCategories } from '@/app/lib/categoriesSlice';

export default function EventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { events, loading, error } = useAppSelector((state) => state.events);

  // Local UI state for filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { categories } = useAppSelector((state) => state.categories);

  // Fetch categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter events with memoization
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchCategory =
        filterCategory === 'All' ||
        event.category.toLowerCase() === filterCategory.toLowerCase();

      const matchSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [events, filterCategory, search]);

  return (
    <div className='p-6 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold'>Events</h1>
      </div>
      <ListHeader
        addLabel='Add Event'
        onAdd={() => router.push('/admin/events/add-event')}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search events...'
        filterValue={filterCategory}
        onFilterChange={setFilterCategory}
        filterOptions={categories.map((cat) => cat.name)}
        showAdd
        showSearch
        showFilter
        showRefresh
        onRefresh={() => dispatch(fetchEvents())}
        disabled={loading}
      />

      {error && (
        <div className='text-red-600 font-semibold'>Error: {error}</div>
      )}

      {loading && (
        <div className='text-center font-medium'>Loading events...</div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className='text-center text-gray-500'>No events found.</div>
      )}

      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
