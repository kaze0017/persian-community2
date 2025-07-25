'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import EventCard from './components/EventCard';
import ListHeader from '@/components/ListHeader';
import { fetchCategories } from '@/app/lib/categoriesSlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, ListIcon } from 'lucide-react';
import Calendar from './components/Calendar';
import { useMediaQuery } from '../utils/useMediaQuery';
import { useMedia } from 'use-media';

export default function EventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);
  const { categories } = useAppSelector((state) => state.categories);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const isLargeScreen = useMedia({ minWidth: 1024 }); // Tailwind lg breakpoint

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchEvents());
  }, [dispatch]);

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

  const ViewButtons = (
    <div className='flex justify-center gap-2'>
      <Button
        variant={'outline'}
        onClick={() => setView('list')}
        className={isLargeScreen ? 'w-40' : 'w-25'}
      >
        <ListIcon className='mr-2 h-4 w-4' />
        {isLargeScreen ? 'List View' : 'List'}
      </Button>
      <Button
        variant={'outline'}
        onClick={() => setView('calendar')}
        className={isLargeScreen ? 'w-40' : 'w-25'}
      >
        <CalendarDays className='mr-2 h-4 w-4' />
        {isLargeScreen ? 'Calendar View' : 'Calendar'}
      </Button>
    </div>
  );

  return (
    <>
      <ListHeader
        addLabel='Add Event'
        onAdd={() => router.push('/admin/events/add-event')}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder='Search events...'
        filterValue={filterCategory}
        onFilterChange={setFilterCategory}
        filterOptions={categories.map((cat) => cat.name)}
        showAdd={false}
        showSearch
        showFilter
        showRefresh
        onRefresh={() => dispatch(fetchEvents())}
        disabled={loading}
        buttons={ViewButtons}
      />

      {view === 'list' && (
        <>
          {error && (
            <div className='text-red-600 font-semibold'>Error: {error}</div>
          )}

          {loading && (
            <div className='text-center font-medium'>Loading events...</div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className='text-center text-gray-500'>No events found.</div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr'>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </>
      )}

      {view === 'calendar' && <Calendar events={filteredEvents} />}
    </>
  );
}
