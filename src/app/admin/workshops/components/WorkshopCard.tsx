'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

import {
  format,
  addDays,
  parseISO,
  isBefore,
  isEqual,
  isSameDay,
} from 'date-fns';
import { Workshop } from '@/types/workshop';

type CalendarEvent = {
  id: string;
  title: string;
  location: string;
  start: string; // ISO string
  end: string; // ISO string
};

const WEEKDAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Combines a Date (day) with a time string (HH:mm) into an ISO string
function combineDateTime(date: Date, time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(hours, minutes, 0, 0);
  return dt.toISOString();
}

export interface WorkshopCardProps {
  workshop: {
    id?: string;
    title: string;
    category: string;
    startDate: string;
    endDate: string;
    bannerUrl?: string;
    instructor?: {
      photoUrl?: string;
      name?: string;
    };
    schedule?: {
      day: string;
      timeRanges: {
        start: string;
        end: string;
        location?: string;
      }[];
    }[];
    price: number;
    language?: string;
    capacity?: number;
    description?: string;
  };
  setSelectedWorkshop: (workshop: Workshop | null) => void;
  setShowForm: (show: boolean) => void;
  handleDelete: (id: string) => void;
}

export default function WorkshopCard({
  workshop,
  setSelectedWorkshop,
  setShowForm,
  handleDelete,
}: WorkshopCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  // Generate all event occurrences between startDate and endDate with time ranges
  const events = useMemo(() => {
    if (!workshop.startDate || !workshop.endDate || !workshop.schedule)
      return [];

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
              id: `${workshop.id ?? 'unknown'}-${format(current, 'yyyyMMdd')}-${i}`,
              title: workshop.title,
              location: tr.location ?? 'Unknown',
              start: combineDateTime(current, tr.start),
              end: combineDateTime(current, tr.end),
            });
          });
        }
      });

      current = addDays(current, 1);
    }

    return allEvents;
  }, [workshop]);

  // Open dialog with events on clicked day
  const openEventsForDate = useCallback(
    (date: Date) => {
      const filteredEvents = events.filter((ev) =>
        isSameDay(new Date(ev.start), date)
      );
      if (filteredEvents.length > 0) {
        setSelectedEvents(filteredEvents);
        setDialogOpen(true);
      }
    },
    [events]
  );

  // Handle day click
  const handleDateClick = useCallback(
    (arg: { date: Date }) => {
      openEventsForDate(arg.date);
    },
    [openEventsForDate]
  );

  // Handle event click (opens same dialog showing all events on that day)
  const handleEventClick = useCallback(
    (arg: { event: { start: Date | null } }) => {
      if (arg.event.start) {
        openEventsForDate(arg.event.start);
      }
    },
    [openEventsForDate]
  );

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
        <Card className='flex flex-col gap-4 p-4 shadow-sm hover:shadow-md transition-shadow'>
          <CollapsibleTrigger asChild>
            <div className='flex items-stretch gap-4 h-32 cursor-pointer'>
              <div className='w-48 h-full rounded-md overflow-hidden bg-muted'>
                {workshop.bannerUrl ? (
                  <Image
                    src={workshop.bannerUrl}
                    alt={`${workshop.title} banner`}
                    width={192}
                    height={128}
                    className='object-cover w-full h-full'
                    unoptimized // optional if external URLs
                  />
                ) : (
                  <div className='w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground'>
                    No Image
                  </div>
                )}
              </div>

              <div className='flex flex-col justify-between flex-1'>
                <div className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <CardTitle>{workshop.title}</CardTitle>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    {workshop.category} —{' '}
                    {new Date(workshop.startDate).toLocaleDateString()}
                  </p>

                  {workshop.instructor?.name && (
                    <div className='flex items-center gap-2 mt-2'>
                      <Image
                        src={workshop.instructor.photoUrl ?? '/placeholder.jpg'}
                        alt={`${workshop.instructor.name}'s small photo`}
                        width={24}
                        height={24}
                        className='rounded-full object-cover border border-gray-300'
                        unoptimized
                      />
                      <p className='text-xs text-muted-foreground'>
                        Instructor: {workshop.instructor.name}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className='flex gap-2 mt-4'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => {
                      setSelectedWorkshop(workshop as Workshop);
                      setShowForm(true);
                    }}
                    aria-label='Edit workshop'
                  >
                    <PencilIcon className='w-4 h-4' />
                  </Button>
                  {workshop.id && (
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(workshop.id!)}
                      aria-label='Delete workshop'
                    >
                      <Trash2Icon className='w-4 h-4' />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className='overflow-hidden transition-all'>
            <div className='border-t pt-4 space-y-3 text-sm text-muted-foreground'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='font-medium'>Price: </span>
                  {workshop.price !== undefined && workshop.price !== null
                    ? `$${workshop.price}`
                    : 'Free'}
                </div>
                <div>
                  <span className='font-medium'>Capacity: </span>
                  {workshop.capacity ?? 'Not specified'}
                </div>
                <div>
                  <span className='font-medium'>Language: </span>
                  {workshop.language ?? 'Not specified'}
                </div>
                <div>
                  <span className='font-medium'>Description: </span>
                  {workshop.description ?? 'No description provided'}
                </div>
              </div>

              <div className='border-t pt-4'>
                <h4 className='font-semibold text-sm mb-2'>
                  Workshop Schedule:
                </h4>
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView='dayGridMonth'
                  events={events}
                  initialDate={workshop.startDate}
                  height='auto'
                  headerToolbar={false}
                  dateClick={handleDateClick}
                  eventClick={handleEventClick}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Popup dialog showing event details */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {selectedEvents.map((ev) => (
              <div key={ev.id} className='border rounded p-3'>
                <h3 className='font-semibold'>{ev.title}</h3>
                <p>
                  <strong>Date:</strong> {format(new Date(ev.start), 'PPPP')}
                </p>
                <p>
                  <strong>Time:</strong> {format(new Date(ev.start), 'p')} -{' '}
                  {format(new Date(ev.end), 'p')}
                </p>
                <p>
                  <strong>Location:</strong> {ev.location}
                </p>
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <Button variant='outline' className='mt-4 w-full'>
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
