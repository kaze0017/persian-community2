'use client';

import { Workshop } from '@/types/workshop';
import { Calendar } from '@/components/ui/calendar';

interface WorkshopsCalendarProps {
  workshops: Workshop[];
}

export default function WorkshopsCalendar({
  workshops,
}: WorkshopsCalendarProps) {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {workshops.map((workshop) => (
          <div key={workshop.id} className='p-4 border rounded-md bg-muted'>
            <h2 className='font-bold text-lg'>{workshop.title}</h2>
            <p className='text-sm text-muted-foreground'>{workshop.category}</p>
            <p className='text-sm text-muted-foreground'>
              Starts: {new Date(workshop.startDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <Calendar
        mode='single'
        selected={undefined}
        className='mx-auto'
        modifiers={{
          booked: workshops.map((w) => new Date(w.startDate)),
        }}
      />
    </div>
  );
}
