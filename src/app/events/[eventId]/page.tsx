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
import EventBookCard from './components/EventBookCard';
import { getEvent } from '@/app/client/events/eventsApi';
import { Event } from '@/types/event';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EventPage() {
  const isAdmin = false;
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const { events, selectedEvent, loading, error } = useAppSelector(
    (state) => state.events
  );
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (typeof eventId !== 'string') return;

    let isMounted = true;

    const loadEvent = async () => {
      try {
        // Find in store first
        const existing = events.find((e) => e.id === eventId);
        let targetEvent: Event | null = existing ?? null;

        // Fetch from backend if not in store
        if (!existing) {
          const result = await dispatch(fetchEventById(eventId)).unwrap();
          targetEvent = result as Event;
        }

        // Refresh from Firestore for freshest data
        if (targetEvent) {
          const fresh = await getEvent(targetEvent.clientId, targetEvent.id);
          if (isMounted) {
            setEvent(fresh ?? targetEvent);
          }
        }
      } catch (err) {
        console.error('❌ Failed to load event:', err);
      }
    };

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [eventId, events, dispatch]);

  if (loading || !selectedEvent) {
    return <div className='text-center py-10'>Loading event...</div>;
  }

  if (error) {
    return <div className='text-center py-10 text-red-500'>{error}</div>;
  }

  // const {
  //   title,
  //   date,
  //   bannerUrls,
  //   description,
  //   sponsors,
  //   tags,
  //   organizers,
  //   address,
  //   coordinates,
  // } = selectedEvent;

  return (
    <div className='max-w-[1280px] mx-auto px-4 space-y-8'>
      {event && (
        <>
          <EventHeaderBanner
            title={event.title}
            date={event.date}
            bannerUrls={event.bannerUrls}
            eventId={eventId as string}
            isAdmin={isAdmin}
          />

          <EventDescription
            description={event?.description || ''}
            isAdmin={isAdmin}
            eventId={eventId as string}
          />

          <EventSchedule
            days={event?.days || []}
            isAdmin={isAdmin}
            eventId={eventId as string}
          />

          <EventBookCard eventId={eventId as string} isAdmin={isAdmin} />

          <EventTagsSponsorsOrganizers
            tags={event?.tags || []}
            sponsors={event?.sponsors || []}
            organizers={event?.organizers || []}
            eventId={eventId as string}
            isAdmin={isAdmin}
          />

          <Image
            src={event.eventLayoutUrl || '/images/event-layout-placeholder.png'}
            alt='Event Layout'
            width={800}
            height={400}
            className='w-full h-auto rounded-lg'
          />

          <EventContactMap
            address={event.address}
            coordinates={event.coordinates}
            isAdmin={isAdmin}
            eventId={eventId as string}
          />
        </>
      )}
    </div>
  );
}
