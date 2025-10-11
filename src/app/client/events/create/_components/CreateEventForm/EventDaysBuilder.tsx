'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import EventDayPanel from '@/app/client/events/create/_components/CreateEventForm/EventDayPanel';

type Props = {
  name?: string; // default: 'days'
};

export default function EventDaysBuilder({ name = 'days' }: Props) {
  const { control } = useFormContext();

  const {
    fields: dayFields,
    append: appendDay,
    remove: removeDay,
  } = useFieldArray({
    control,
    name,
  });

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold'>Event Schedule</h3>

      {dayFields.map((day, dayIndex) => {
        const dayName = `${name}.${dayIndex}`;
        return (
          <div key={day.id} className='space-y-2'>
            <EventDayPanel dayIndex={dayIndex} namePrefix={dayName} />

            <Button
              type='button'
              variant='ghost'
              className='text-red-500'
              onClick={() => removeDay(dayIndex)}
            >
              Remove Day
            </Button>
          </div>
        );
      })}

      <Button
        type='button'
        onClick={() => appendDay({ date: '', blocks: [] })}
        className='mt-4'
      >
        + Add Day
      </Button>
    </div>
  );
}
