import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UseFormRegister } from 'react-hook-form';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';

interface DescriptionSectionProps {
  register: UseFormRegister<WorkshopFormValues>;
}
export function DescriptionSection({ register }: DescriptionSectionProps) {
  return (
    <div className='space-y-2'>
      <Label>Description</Label>
      <Textarea {...register('description')} />
    </div>
  );
}
