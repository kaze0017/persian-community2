'use client';

import useMedia from 'use-media';
import { useMemo, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import WorkshopCardHeader from './WorkshopCardHeader';
import WorkshopCardDetailsDialog from './WorkshopCardDetailsDialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Workshop } from '@/types/workshop';
import Details from './Details';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { parseISO, addDays, isBefore, isEqual, isSameDay } from 'date-fns';
import WorkshopCardEventDialog from './WorkshopCardEventDialog';
import { CalendarEvent } from './types';
import { Button } from '@/components/ui/button';
import { boxShadow } from '@/app/components/filters/logoFilter';

interface Props {
  workshop: Workshop;
}

export default function WorkshopCardForUsers({ workshop }: Props) {
  const isLargeScreen = useMedia({ minWidth: 1024 }); // Tailwind lg breakpoint
  const [open, setOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const events = useMemo(() => {
    if (!workshop.startDate || !workshop.endDate || !workshop.schedule)
      return [];

    const WEEKDAY_MAP: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const start = parseISO(workshop.startDate);
    const end = parseISO(workshop.endDate);
    let current = start;
    const allEvents: CalendarEvent[] = [];

    while (isBefore(current, addDays(end, 1)) || isEqual(current, end)) {
      const weekday = current.getDay();
      workshop.schedule.forEach((sch) => {
        if (WEEKDAY_MAP[sch.day] === weekday) {
          sch.timeRanges.forEach((tr, i) => {
            allEvents.push({
              id: `${workshop.id}-${current}-${i}`,
              title: workshop.title,
              location: tr.location ?? 'Unknown',
              start:
                new Date(current).toISOString().split('T')[0] + 'T' + tr.start,
              end: new Date(current).toISOString().split('T')[0] + 'T' + tr.end,
            });
          });
        }
      });
      current = addDays(current, 1);
    }

    return allEvents;
  }, [workshop]);

  const openEventsForDate = useCallback(
    (date: Date) => {
      const filtered = events.filter((ev) =>
        isSameDay(new Date(ev.start), date)
      );
      if (filtered.length > 0) {
        setSelectedEvents(filtered);
        setEventDialogOpen(true);
      }
    },
    [events]
  );

  const handleDateClick = useCallback(
    (arg: { date: Date }) => {
      openEventsForDate(arg.date);
    },
    [openEventsForDate]
  );

  const handleEventClick = useCallback(
    (arg: { event: { start: Date | null } }) => {
      if (!arg.event.start) return;
      openEventsForDate(arg.event.start);
    },
    [openEventsForDate]
  );

  // === Large screen (dialog) ===
  if (isLargeScreen) {
    return (
      <>
        <Card
          onClick={() => setOpen(true)}
          className='cursor-pointer p-4 w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg'
          style={{ boxShadow }}
        >
          <WorkshopCardHeader workshop={workshop} />
        </Card>

        <WorkshopCardDetailsDialog
          workshop={workshop}
          open={open}
          setOpen={setOpen}
        />

        <WorkshopCardEventDialog
          events={selectedEvents}
          open={eventDialogOpen}
          setOpen={setEventDialogOpen}
        />
      </>
    );
  }

  // === Small screen (collapsible) ===
  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        {!open && (
          <Card
            onClick={() => setOpen(true)}
            className='cursor-pointer p-4 shadow-sm hover:shadow-md transition'
          >
            <WorkshopCardHeader workshop={workshop} />
          </Card>
        )}
        {open && (
          <>
            <CollapsibleContent className='px-4 pt-2 pb-4'>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setOpen(false)}
                  className='mb-2'
                >
                  ← Back
                </Button>
              </div>
              <Details workshop={workshop} />
              <h4 className='font-semibold text-sm mb-2'>Schedule</h4>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                events={events}
                initialDate={workshop.startDate}
                headerToolbar={false}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height='auto'
              />
            </CollapsibleContent>
            <WorkshopCardEventDialog
              events={selectedEvents}
              open={eventDialogOpen}
              setOpen={setEventDialogOpen}
            />
          </>
        )}
      </Collapsible>
    </>
  );
}
