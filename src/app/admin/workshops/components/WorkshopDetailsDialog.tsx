'use client';
import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { WorkshopCardProps } from './WorkshopCard';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

interface WorkshopDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: WorkshopCardProps['workshop'];
}

export default function WorkshopDetailsDialog({
  open,
  onOpenChange,
  workshop,
}: WorkshopDetailsDialogProps) {
  const events = useMemo(() => {
    if (!workshop.startDate) return [];
    return [
      {
        id: workshop.id || '1',
        title: workshop.title,
        date: workshop.startDate,
      },
    ];
  }, [workshop]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{workshop.title}</DialogTitle>
          <DialogDescription>
            {workshop.category} |{' '}
            {new Date(workshop.startDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {workshop.instructor?.photoUrl && (
          <Image
            src={workshop.instructor.photoUrl}
            alt={`${workshop.instructor.name}'s photo`}
            width={200}
            height={200}
            className='rounded object-cover mx-auto'
          />
        )}

        <p className='text-center mt-4 text-sm text-muted-foreground'>
          Instructor: {workshop.instructor?.name ?? 'N/A'}
        </p>

        <div className='mt-4'>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView='dayGridMonth'
            events={events}
            initialDate={workshop.startDate}
            height='auto'
            headerToolbar={false}
          />
        </div>

        <DialogClose asChild>
          <Button variant='outline' className='w-full'>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
