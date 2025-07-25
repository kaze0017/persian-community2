'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { Event } from '@/types/event';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventReviewCard from './EventReviewCard';

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function onDateClick(arg: DateClickArg) {
    setSelectedDate(arg.dateStr);
    setIsOpen(true);
  }

  function onEventClick(arg: EventClickArg) {
    setSelectedDate(arg.event.startStr?.split('T')[0] || null);
    setIsOpen(true);
  }

  const eventsForSelectedDate = selectedDate
    ? events.filter((ev) => ev.date === selectedDate)
    : [];

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        events={events}
        dateClick={onDateClick}
        eventClick={onEventClick}
        height='auto'
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Events on {selectedDate}</DialogTitle>
            <DialogDescription>
              {eventsForSelectedDate.length === 0 && 'No events on this date.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 mb-4'>
            {eventsForSelectedDate.map((ev) => (
              <EventReviewCard key={ev.id} ev={ev} />
            ))}
          </div>
          <DialogClose asChild>
            <Button variant='outline' className='w-full'>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
