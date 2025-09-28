'use client';

import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { updateEvent } from '@/app/client/events/eventsApi';
import { useAppSelector } from '@/app/hooks';
import EventDaysBuilder from '@/app/admin/events/add-event/components/EventDaysBuilder';

type ScheduleValues = {
  days: Event['days'];
};

export default function EventScheduleTab({
  event,
  onSubmit,
}: {
  event: Event | undefined;
  onSubmit: (data: Partial<Event>) => void;
}) {
  const userId = useAppSelector((s) => s.user?.uid || '');
  const [dirty, setDirty] = useState(false);

  const methods = useForm<ScheduleValues>({
    defaultValues: {
      days: [],
    },
  });

  const { handleSubmit, reset } = methods;

  const handleFormSubmit: SubmitHandler<ScheduleValues> = async (data) => {
    if (!event) return;
    try {
      const parsedDays = (data.days || []).map((day) => ({
        ...day,
        blocks: (day.blocks || []).map((block) => ({
          ...block,
          activities:
            typeof block.activities === 'string'
              ? block.activities
                  .split(',')
                  .map((a) => a.trim())
                  .filter(Boolean)
              : block.activities || [],
        })),
      }));

      const updates: Partial<Event> = { days: parsedDays };

      await updateEvent(userId, event.id, updates);
      onSubmit(updates);
      setDirty(false);
    } catch (err) {
      console.error('❌ Failed to update schedule:', err);
    }
  };

  useEffect(() => {
    if (event) {
      reset({ days: event.days || [] });
      setDirty(false);
    }
  }, [event, reset]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='space-y-6 relative'
      >
        <div className='space-y-4'>
          <h3 className='text-xl font-semibold'>Event Schedule</h3>
          <p className='text-sm text-muted-foreground'>
            Edit the days, blocks, and activities for this event.
          </p>

          {/* ✅ Now EventDaysBuilder has access to form context */}
          <EventDaysBuilder name='days' setDirty={setDirty} />
        </div>

        {dirty && (
          <div className='sticky bottom-4 right-0 flex justify-end gap-3 px-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => {
                reset(event ? { days: event.days || [] } : { days: [] });
                setDirty(false);
              }}
            >
              Discard
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
