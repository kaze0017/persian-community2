'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Workshop } from '@/types/workshop';
import WorkshopCardHeader from './WorkshopCardHeader';
import WorkshopCardDetailsDialog from './WorkshopCardDetailsDialog';

interface Props {
  workshop: Workshop;
}

export default function WorkshopCardForUsers({ workshop }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setDialogOpen(true)}
        className='flex flex-col p-4 shadow-sm hover:shadow-md transition cursor-pointer'
      >
        <WorkshopCardHeader workshop={workshop} />
      </Card>

      <WorkshopCardDetailsDialog
        workshop={workshop}
        open={dialogOpen}
        setOpen={setDialogOpen}
      />
    </>
  );
}
