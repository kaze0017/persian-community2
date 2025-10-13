'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchSiteEvent } from '../siteEventReducer';
import EventHeaderBanner from './components/EventHeaderBanner';
import EventDescription from './components/EventDescription';
import EventSchedule from './components/EventSchedule';
import EventTagsSponsorsOrganizers from './components/EventTagsSponsorsOrganizers';
import EventContactMap from './components/EventContactMap';
import EventBookCard from './components/EventBookCard';
import Image from 'next/image';
import EventHike from './components/EventHike';

export default function EventPage() {
  const isAdmin = false;
  const { eventId } = useParams();
  const dispatch = useAppDispatch();
  const {
    event: selectedEvent,
    loading,
    error,
  } = useAppSelector((state) => state.siteEvent);

  useEffect(() => {
    if (!eventId || typeof eventId !== 'string') return;
    dispatch(fetchSiteEvent(eventId));
  }, [eventId, dispatch]);

  if (loading) {
    return <div className='text-center py-10'>Loading event...</div>;
  }

  if (error) {
    return <div className='text-center py-10 text-red-500'>{error}</div>;
  }

  if (!selectedEvent) {
    return <div className='text-center py-10'>Event not found</div>;
  }

  const event = selectedEvent;
  console.log('Event data:', event.hikeMap);

  return (
    <div className='max-w-[1280px] mx-auto px-4 space-y-8 w-full'>
      <EventHeaderBanner
        title={event.title}
        date={event.date}
        bannerUrls={event.bannerUrls}
        eventId={eventId as string}
        isAdmin={isAdmin}
      />

      <EventDescription
        description={event.description || ''}
        isAdmin={isAdmin}
        eventId={eventId as string}
      />

      {event.days && event.eventConfig?.scheduleConfig?.isEnabled && (
        <EventSchedule
          days={event.days}
          isAdmin={isAdmin}
          eventId={eventId as string}
        />
      )}

      {event.eventConfig?.ticketsConfig?.isEnabled && (
        <EventBookCard eventId={eventId as string} isAdmin={isAdmin} />
      )}

      {event.eventConfig?.tagsConfig?.isEnabled && (
        <EventTagsSponsorsOrganizers
          tags={event.tags || []}
          sponsors={event.sponsors || []}
          organizers={event.organizers || []}
          eventId={eventId as string}
          isAdmin={isAdmin}
        />
      )}

      {event.eventConfig?.layoutConfig?.isEnabled && (
        <Image
          src={event.eventLayoutUrl || '/images/event-layout-placeholder.png'}
          alt='Event Layout'
          width={800}
          height={400}
          className='w-full h-auto rounded-lg'
        />
      )}

      {event.eventConfig?.contactConfig?.isEnabled && (
        <EventContactMap
          address={event.address}
          coordinates={event.coordinates}
          isAdmin={isAdmin}
          eventId={eventId as string}
        />
      )}
      {/* {event.eventConfig?.hikeMapConfig?.isEnabled && event.hikeMap && (
        <EventHike hikeMap={event.hikeMap} />
      )} */}
    </div>
  );
}
