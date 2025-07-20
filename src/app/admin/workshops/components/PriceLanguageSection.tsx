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
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';

interface PriceLanguageSectionProps {
  register: UseFormRegister<WorkshopFormValues>;
  setValue: UseFormSetValue<WorkshopFormValues>;
  language?: string;
}

export function PriceLanguageSection({
  register,
  setValue,
  language,
}: PriceLanguageSectionProps) {
  return (
    <div className='flex gap-4'>
      <div className='flex-1 space-y-2'>
        <Label>Price</Label>
        <Input
          type='number'
          {...register('price', { valueAsNumber: true })}
          placeholder='Enter price'
        />
      </div>
      <div className='flex-1 space-y-2'>
        <Label>Capacity</Label>
        <Input
          type='number'
          {...register('capacity', { valueAsNumber: true })}
          placeholder='Max participants'
        />
      </div>
      <div className='flex-1 space-y-2'>
        <Label>Language</Label>
        <Select
          onValueChange={(value) =>
            setValue(
              'language',
              value as 'English' | 'French' | 'Farsi' | 'Other'
            )
          }
          defaultValue={language}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Language' />
          </SelectTrigger>
          <SelectContent>
            {['English', 'French', 'Farsi', 'Other'].map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
