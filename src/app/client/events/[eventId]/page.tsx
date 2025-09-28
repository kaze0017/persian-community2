'use client';
import React from 'react';
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

// Import your reusable component
import GlassTabsComponent from '@/components/glassTabsComponent/GlassTabsComponent';

// Import tab panels
import EventInfoTab from './_components/EventInfoTab';
import { Event } from '@/types/event'; // 👈 import your type
import EventScheduleTab from './_components/EventScheduleTab';
import EventLayoutTab from './_components/EventLayoutTab';

export default function GlassTabs() {
  const { eventId }: { eventId: string } = useParams();
  const clientId = useAppSelector((s) => s.user?.uid || '');
  const dispatch = useAppDispatch();

  // Select event directly from Redux
  const matchedEvent = useAppSelector((s) =>
    s.clientEvents.events.find((e: Event) => e.id === eventId)
  );

  const { handleSubmit } = useForm();
  const [dirty, setDirty] = React.useState(false);

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log('Saving...', data);
    setDirty(false);
  };

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
              panel: <div>UI settings coming soon...</div>,
            },
            {
              value: 'delete',
              label: 'Delete',
              icon: MonitorSmartphone,
              panel: <div>Delete settings coming soon...</div>,
            },
          ]}
        />
      </motion.div>
    </div>
  );
}
