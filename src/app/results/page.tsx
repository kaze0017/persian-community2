'use client';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../hooks';
import BusinessCard from '../admin/show-businesses/components/BusinessCard';
import WorkshopCardForUsers from '../workshops/_components/_subComponents/WorkshopCardForUsers';
import EventCard from '@/app/events/components/EventCard';
import { Event } from '@/types/event';
import { Business } from '@/types/business';
import { Workshop } from '@/types/workshop';
import Link from 'next/link';
import MinimalistGlassmorphic from '../components/businesses/MinimalistGlassmorphic';
import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import { fetchBusinesses } from '../lib/businessesSlice';
import { fetchWorkshops } from '../admin/workshops/workshopSlice';
import SectionHeader from '../test/components/SectionHeader';

// import WorkshopCard from '../admin/workshops/components/WorkshopCard';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const itemsParam = searchParams.get('items') || '';

  const { events } = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchEvents());
    dispatch(fetchWorkshops());
  }, [dispatch]);
  const { workshops } = useAppSelector((state) => state.workshops);
  const businesses = useAppSelector((state) => state.businesses.items ?? []);

  // Decode and split into id:type pairs
  const results = itemsParam
    .split(',')
    .filter(Boolean)
    .map((p) => {
      const [id, type] = p.split(':');
      return { id, type };
    });

  const eventsToDisplay = useMemo(() => {
    return events.filter(
      (event: Event) =>
        event.id &&
        results.some((r) => r.id === event.id && r.type === 'events')
    );
  }, [events, results]);
  const businessesToDisplay = useMemo(() => {
    return businesses.filter(
      (business: Business) =>
        business.id &&
        results.some((r) => r.id === business.id && r.type === 'businesses')
    );
  }, [businesses, results]);

  const workshopsToDisplay = useMemo(() => {
    return workshops.filter(
      (workshop: Workshop) =>
        workshop.id &&
        results.some((r) => r.id === workshop.id && r.type === 'workshops')
    );
  }, [workshops, results]);

  return (
    <div className='p-4'>
      <h1 className='mb-4'>Search Results</h1>
      {businessesToDisplay.length > 0 && (
        <>
          <SectionHeader header='Businesses' linkPath='businesses' />
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center'>
            {businessesToDisplay.map((business: Business) => (
              <Link href={`/businesses/${business.id}`} key={business.id}>
                <MinimalistGlassmorphic business={business} />
              </Link>
            ))}
          </div>
        </>
      )}
      {eventsToDisplay.length > 0 && (
        <>
          <SectionHeader header='Events' linkPath='events' />
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr'>
            {eventsToDisplay.map((event: Event) => (
              <Link href={`/events/${event.id}`} key={event.id}>
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        </>
      )}
      {workshopsToDisplay.length > 0 && (
        <>
          <SectionHeader header='Workshops' linkPath='workshops' />
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {workshopsToDisplay.map((workshop: Workshop) => (
              <Link href={`/workshops/${workshop.id}`} key={workshop.id}>
                <WorkshopCardForUsers workshop={workshop} />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
