'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Person } from '@/types/person';

interface PersonFormProps {
  initialData?: Partial<Person>;
  onSave: (data: Partial<Person>) => void;
  onCancel: () => void;
}

export function PersonForm({ initialData, onSave, onCancel }: PersonFormProps) {
  const { register, handleSubmit } = useForm<Partial<Person>>({
    defaultValues: initialData || {},
  });

  const onSubmit = (data: Partial<Person>) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md'>
      <div>
        <Label>Name</Label>
        <Input {...register('name', { required: true })} required />
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea {...register('bio')} />
      </div>

      <div>
        <Label>Photo URL</Label>
        <Input {...register('photoUrl')} type='url' />
      </div>

      <div>
        <Label>LinkedIn URL</Label>
        <Input {...register('linkedInUrl')} type='url' />
      </div>

      <div>
        <Label>Email (for connection request)</Label>
        <Input {...register('email')} type='email' />
      </div>

      <div className='flex gap-4 mt-4'>
        <Button type='submit'>Save</Button>
        <Button variant='outline' type='button' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
