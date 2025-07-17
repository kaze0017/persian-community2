'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import EventCard from './components/EventCard';
import ListHeader from '@/components/ListHeader';
import { fetchCategories } from '@/app/lib/categoriesSlice';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Calendar from './components/Calendar';

export default function EventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { events, loading, error } = useAppSelector((state) => state.events);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { categories } = useAppSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
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

  return (
    <Tabs defaultValue='list' className='w-full max-w-6xl mx-auto p-6'>
      <TabsList className='grid w-full grid-cols-2 mb-6'>
        <TabsTrigger value='list'>List View</TabsTrigger>
        <TabsTrigger value='calendar'>Calendar View</TabsTrigger>
      </TabsList>

      <TabsContent value='list'>
        <Card className='p-6'>
          <div className='space-y-8'>
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
              showAdd={false}
              showSearch
              showFilter={true}
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

            <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr'>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value='calendar'>
        <Card className='p-6 text-center text-muted-foreground'>
          <Calendar events={events} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
