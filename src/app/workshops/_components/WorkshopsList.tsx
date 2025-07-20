'use client';
import { Workshop } from '@/types/workshop';
import WorkshopCardForUsers from './_subComponents/WorkshopCardForUsers';

interface WorkshopsListProps {
  workshops: Workshop[];
}

export default function WorkshopsList({ workshops }: WorkshopsListProps) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {workshops.map((workshop) => (
          <WorkshopCardForUsers key={workshop.id} workshop={workshop} />
        ))}
      </div>
    </div>
  );
}
