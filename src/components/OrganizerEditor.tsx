'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

export default function OrganizerEditor() {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'organizers',
  });

  return (
    <div className='space-y-4'>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='border p-4 rounded-xl relative space-y-2'
        >
          <div>
            <label className='block text-sm'>Name</label>
            <Input {...register(`organizers.${index}.name`)} />
          </div>
          <div>
            <label className='block text-sm'>Contact</label>
            <Input {...register(`organizers.${index}.contact`)} />
          </div>
          <div>
            <label className='block text-sm'>Image URL (optional)</label>
            <Input {...register(`organizers.${index}.imageUrl`)} />
          </div>
          <Button
            type='button'
            variant='ghost'
            onClick={() => remove(index)}
            className='absolute top-2 right-2 text-red-500'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      ))}
      <Button
        type='button'
        variant='outline'
        onClick={() => append({ name: '', contact: '', imageUrl: '' })}
      >
        <Plus className='w-4 h-4 mr-1' /> Add Organizer
      </Button>
    </div>
  );
}
