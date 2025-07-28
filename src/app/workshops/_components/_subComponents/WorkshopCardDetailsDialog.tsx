'use client';
import { Workshop } from '@/types/workshop';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { parseISO, addDays, isBefore, isEqual, isSameDay } from 'date-fns';
import { useMemo, useState, useCallback } from 'react';
import { CalendarEvent } from './types';
import WorkshopCardEventDialog from './WorkshopCardEventDialog';
import Details from './Details';

interface Props {
  workshop: Workshop;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function WorkshopCardDetailsDialog({
  workshop,
  open,
  setOpen,
}: Props) {
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);

  const events = useMemo(() => {
    if (!workshop.startDate || !workshop.endDate || !workshop.schedule)
      return [];

    const WEEKDAY_MAP = {
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

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogTitle>Workshop Details</DialogTitle>
          <div className='mt-4'>
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
          </div>
        </DialogContent>
      </Dialog>

      <WorkshopCardEventDialog
        events={selectedEvents}
        open={eventDialogOpen}
        setOpen={setEventDialogOpen}
      />
    </>
  );
}
