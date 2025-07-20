'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { CalendarEvent } from './types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Props {
  events: CalendarEvent[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function WorkshopCardEventDialog({
  events,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {events.map((ev) => (
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
  );
}
