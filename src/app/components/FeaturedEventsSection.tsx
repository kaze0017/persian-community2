'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import EventCarousel from './subComponents/EventCarousel';

export default function FeaturedEventsSection() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  if (loading) return <p>Loading featured events...</p>;
  if (events.length === 0) return <p>No featured events available.</p>;

  return (
    <div className='p-2 w-full border border-amber-300'>
      <EventCarousel events={events} />
    </div>
  );
}
