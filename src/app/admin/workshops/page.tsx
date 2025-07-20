'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { WorkshopForm } from './components/WorkshopForm';
import type { Workshop } from '@/types/workshop';
import {
  fetchWorkshops,
  deleteWorkshop,
} from '@/app/admin/workshops/workshopSlice';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
import WorkshopCard from './components/WorkshopCard';
import { saveWorkshop } from '@/app/admin/workshops/workshopService';
import { mapWorkshopToFormValues } from './workshopHelpers';

export default function AdminWorkshopsPage() {
  const dispatch = useAppDispatch();
  const { workshops, loading, error } = useAppSelector(
    (state) => state.workshops
  );

  const [showForm, setShowForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );

  // Fetch workshops on mount
  useEffect(() => {
    dispatch(fetchWorkshops());
  }, [dispatch]);

  // Handler for form submit (add or update)
  async function handleFormSubmit(
    data: WorkshopFormValues,
    bannerFile?: File | null
  ) {
    try {
      await saveWorkshop(
        dispatch,
        data,
        bannerFile,
        selectedWorkshop?.id,
        selectedWorkshop?.bannerUrl ?? ''
      );
      setShowForm(false);
      setSelectedWorkshop(null);
      dispatch(fetchWorkshops());
    } catch (e) {
      console.error('Error saving workshop:', e);
    }
  }

  // Handler to delete workshop
  function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this workshop?')) {
      dispatch(deleteWorkshop(id));
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Manage Workshops & Classes</h1>
        <Button
          onClick={() => {
            setSelectedWorkshop(null);
            setShowForm(true);
          }}
        >
          <PlusIcon className='mr-2 h-4 w-4' /> New Workshop
        </Button>
      </div>

      {loading && <p>Loading workshops...</p>}
      {error && <p className='text-red-600'>Error: {error}</p>}

      <div className='space-y-4'>
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            setSelectedWorkshop={setSelectedWorkshop}
            setShowForm={setShowForm}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {showForm && (
        <WorkshopForm
          initialData={
            selectedWorkshop
              ? mapWorkshopToFormValues(selectedWorkshop)
              : undefined
          }
          onClose={() => setShowForm(false)}
          onSubmit={(data, bannerFile) => handleFormSubmit(data, bannerFile)}
        />
      )}
    </div>
  );
}
