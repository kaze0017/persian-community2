'use client';
import { useEffect } from 'react';
import EventCard from '@/app/client/events/_components/EventCard';
import { textGlow, filter } from '@/app/components/filters/logoFilter';
import Image from 'next/image';
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchUserEvents } from '../clientReducer/clientEventsReducer';
import { Event } from '@/types/event';

export default function page() {
  const events = useAppSelector((state) => state.clientEvents.events);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserEvents('ZRVS5M49mhPUgZNi0hpNH8PCS7E3')); // Replace with actual user ID
  }, [dispatch]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
      <EventCard event={null} />
      {events.map((event: Event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
