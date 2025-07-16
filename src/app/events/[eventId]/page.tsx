'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchEventById,
  setSelectedEvent,
} from '@/app/admin/events/reducer/eventsSlice';
import EventHeaderBanner from './components/EventHeaderBanner';
import EventDescription from './components/EventDescription';
import EventSchedule from './components/EventSchedule';
import EventTagsSponsorsOrganizers from './components/EventTagsSponsorsOrganizers';
import EventContactMap from './components/EventContactMap';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventBookCard from './components/EventBookCard';

export default function EventPage() {
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const { events, selectedEvent, loading, error } = useAppSelector(
    (state) => state.events
  );

  useEffect(() => {
    if (typeof eventId !== 'string') return;

    const existing = events.find((e) => e.id === eventId);
    if (existing) {
      dispatch(setSelectedEvent(eventId));
    } else {
      dispatch(fetchEventById(eventId));
    }
  }, [eventId, events, dispatch]);

  if (loading || !selectedEvent) {
    return <div className='text-center py-10'>Loading event...</div>;
  }

  if (error) {
    return <div className='text-center py-10 text-red-500'>{error}</div>;
  }

  const {
    title,
    date,
    bannerUrl,
    description,
    sponsors,
    tags,
    organizers,
    address,
    coordinates,
  } = selectedEvent;
  const isAdmin = true;

  return (
    <div className='max-w-[1280px] mx-auto px-4 space-y-8'>
      <EventHeaderBanner
        title={title}
        date={date}
        bannerUrl={bannerUrl}
        eventId={eventId as string}
        isAdmin={isAdmin}
      />

      <EventDescription
        description={description}
        isAdmin={isAdmin}
        eventId={eventId as string}
      />

      <EventSchedule
        days={selectedEvent.days || []}
        isAdmin={isAdmin}
        eventId={eventId as string}
      />

      <EventTagsSponsorsOrganizers
        tags={tags}
        sponsors={sponsors}
        organizers={organizers}
        eventId={eventId as string}
        isAdmin={isAdmin}
      />

      <EventBookCard eventId={eventId as string} isAdmin={isAdmin} />

      <EventContactMap
        address={address}
        coordinates={coordinates}
        isAdmin={isAdmin}
        eventId={eventId as string}
      />
    </div>
  );
}
