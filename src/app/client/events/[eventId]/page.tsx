'use client';
import React, { useEffect } from 'react';
import {
  Info,
  Calendar,
  LayoutDashboard,
  MonitorSmartphone,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/hooks';

import GlassTabsComponent from '@/components/glassTabsComponent/GlassTabsComponent';
import EventInfoTab from './_components/EventInfoTab';
import EventScheduleTab from './_components/EventScheduleTab';
import EventLayoutTab from './_components/EventLayoutTab';
import EventUiTab from './_components/EventUITab';
import EventDeleteTab from './_components/EventDeleteTab';
import { fetchUserEvents } from '../clientEventsReducer';
import { Event } from '@/types/event';
import HikeMap from '@/app/components/hikeMap/HikeMap';

export default function GlassTabs() {
  const { eventId }: { eventId: string } = useParams();
  const clientId = useAppSelector((s) => s.user?.uid || '');
  const dispatch = useAppDispatch();

  const events = useAppSelector((s) => s.clientEvents.events);
  const loading = useAppSelector((s) => s.clientEvents.loading);

  // Find the event in the Redux store
  let matchedEvent = events.find((e: Event) => e.id === eventId);

  // Fetch events if not present
  useEffect(() => {
    if (!matchedEvent && clientId) {
      dispatch(fetchUserEvents(clientId));
    }
  }, [matchedEvent, clientId, dispatch]);

  const { handleSubmit } = useForm();
  const [dirty, setDirty] = React.useState(false);

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log('Saving...', data);
    setDirty(false);
  };

  // Optionally show a loading state while fetching
  if (!matchedEvent) {
    return (
      <div className='w-full max-w-6xl mx-auto p-4 md:p-6 text-center text-white'>
        {loading ? 'Loading event...' : 'Event not found'}
      </div>
    );
  }

  return (
    <div className='w-full max-w-6xl mx-auto p-4 md:p-6'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='relative'
      >
        <GlassTabsComponent
          defaultValue='info'
          tabs={[
            {
              value: 'info',
              label: 'Info',
              icon: Info,
              panel: (
                <EventInfoTab
                  event={matchedEvent}
                  onSubmit={onSubmit}
                  clientId={clientId}
                />
              ),
            },
            {
              value: 'schedule',
              label: 'Schedule',
              icon: Calendar,
              panel: (
                <EventScheduleTab event={matchedEvent} onSubmit={onSubmit} />
              ),
            },
            {
              value: 'layout',
              label: 'Layout',
              icon: LayoutDashboard,
              panel: <EventLayoutTab eventId={eventId} clientId={clientId} />,
            },
            {
              value: 'ui',
              label: 'UI',
              icon: MonitorSmartphone,
              panel: <EventUiTab event={matchedEvent} clientId={clientId} />,
            },
            {
              value: 'delete',
              label: 'Delete',
              icon: MonitorSmartphone,
              panel: <EventDeleteTab eventId={eventId} clientId={clientId} />,
            },
            {
              value: 'hikeMap',
              label: 'Hike Map',
              icon: MonitorSmartphone,
              panel: <HikeMap eventId={eventId} />,
            },
          ]}
        />
      </motion.div>
    </div>
  );
}
