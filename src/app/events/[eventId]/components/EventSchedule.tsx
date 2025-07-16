'use client';

import { useState } from 'react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import EventDayTimeline from '@/app/events/components/EventDayTimeline';
import EventDayPanel from '@/app/admin/events/add-event/components/EventDayPanel';

import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { updateDocument } from '@/services/firestoreService';

import { EventDay } from '@/types/event';
import { Button } from '@/components/ui/button';

type FormData = {
  days: EventDay[];
};

type Props = {
  days: EventDay[];
  isAdmin?: boolean;
  eventId: string;
};

export default function EventSchedule({
  days,
  isAdmin = false,
  eventId,
}: Props) {
  const methods = useForm<FormData>({
    defaultValues: { days },
  });

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control: methods.control,
    name: 'days',
  });

  const [editing, setEditing] = useState(false);
  const [currentDays, setCurrentDays] = useState<EventDay[]>(days);

  const onSubmit = async (data: FormData) => {
    try {
      await updateDocument('events', eventId, { days: data.days });
      setCurrentDays(data.days); // update display data after save
      setEditing(false); // exit edit mode
    } catch (err) {
      console.error('Error updating schedule:', err);
    }
  };

  const content = (
    <>
      {isAdmin && (
        <AdminControlsPanel
          isAdmin={isAdmin}
          title='Event Details'
          updating={false}
          toggles={[]}
          uploads={[]}
          buttons={[
            {
              label: editing ? 'View Schedule' : 'Edit Schedule',
              onClick: () => setEditing((v) => !v),
            },
          ]}
        />
      )}

      {editing ? (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {dayFields.map((day, index) => (
              <div key={day.id} className='mb-6'>
                <EventDayPanel dayIndex={index} namePrefix={`days.${index}`} />
                <button
                  type='button'
                  className='mt-2 text-red-600 hover:underline'
                  onClick={() => removeDay(index)}
                >
                  Remove Day
                </button>
              </div>
            ))}
            <div className='flex items-start gap-2 mt-4'>
              <Button
                type='button'
                variant='secondary'
                className='min-w-[140px]'
                onClick={() =>
                  appendDay({
                    date: '',
                    blocks: [],
                  })
                }
              >
                + Add Day
              </Button>

              <Button type='submit' className='min-w-[140px]'>
                Save Schedule
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        currentDays.map((day) => <EventDayTimeline key={day.date} day={day} />)
      )}
    </>
  );
  return isAdmin ? <SectionPanel>{content}</SectionPanel> : content;
}
