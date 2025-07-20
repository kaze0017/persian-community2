import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkshopCategory } from '@/types/workshop';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';

interface BasicInfoSectionProps {
  register: UseFormRegister<WorkshopFormValues>;
  setValue: UseFormSetValue<WorkshopFormValues>;
  category: WorkshopCategory;
}

const categories: WorkshopCategory[] = [
  'Language',
  'Career',
  'Tech',
  'Health',
  'Other',
];

export function BasicInfoSection({
  register,
  setValue,
  category,
}: BasicInfoSectionProps) {
  return (
    <>
      <div className='space-y-2'>
        <Label>Title</Label>
        <Input {...register('title')} />
      </div>

      <div className='space-y-2'>
        <Label>Category</Label>
        <Select
          onValueChange={(value) =>
            setValue('category', value as WorkshopCategory)
          }
          defaultValue={category}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex gap-4'>
        <div className='flex-1 space-y-2'>
          <Label>Start Date</Label>
          <Input type='date' {...register('startDate')} />
        </div>
        <div className='flex-1 space-y-2'>
          <Label>End Date</Label>
          <Input type='date' {...register('endDate')} />
        </div>
      </div>
    </>
  );
}
