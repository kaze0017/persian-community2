'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Control,
  UseFormRegister,
  // UseFormSetValue,
  useFieldArray,
} from 'react-hook-form';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
import { Weekday } from '@/types/workshop';

interface DayScheduleInputProps {
  dayScheduleIndex: number;
  day: Weekday;
  control: Control<WorkshopFormValues>;
  register: UseFormRegister<WorkshopFormValues>;
  // setValue: UseFormSetValue<WorkshopFormValues>;
  removeScheduleDay: (index: number) => void;
}

export default function DayScheduleInput({
  dayScheduleIndex,
  day,
  control,
  register,
  // setValue,
  removeScheduleDay,
}: DayScheduleInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schedule.${dayScheduleIndex}.timeRanges`,
  });

  return (
    <div className='space-y-4 border p-4 rounded'>
      <h4 className='font-semibold'>{day}</h4>

      <div className='space-y-4'>
        {fields.map((field, timeIndex) => (
          <div key={field.id} className='border rounded p-3 space-y-2'>
            <div className='flex gap-4'>
              <div className='flex-1 space-y-1'>
                <Label>Start Time</Label>
                <Input
                  type='time'
                  {...register(
                    `schedule.${dayScheduleIndex}.timeRanges.${timeIndex}.start` as const
                  )}
                />
              </div>
              <div className='flex-1 space-y-1'>
                <Label>End Time</Label>
                <Input
                  type='time'
                  {...register(
                    `schedule.${dayScheduleIndex}.timeRanges.${timeIndex}.end` as const
                  )}
                />
              </div>
            </div>

            <div className='space-y-1'>
              <Label>Location</Label>
              <Input
                {...register(
                  `schedule.${dayScheduleIndex}.timeRanges.${timeIndex}.location` as const
                )}
                placeholder='Location for this time range'
              />
            </div>

            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => remove(timeIndex)}
            >
              Remove Time Range
            </Button>
          </div>
        ))}
      </div>

      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => append({ start: '', end: '', location: '' })}
      >
        + Add Time Range
      </Button>

      <Button
        variant='destructive'
        type='button'
        onClick={() => removeScheduleDay(dayScheduleIndex)}
        className='mt-4'
      >
        Remove Day
      </Button>
    </div>
  );
}
