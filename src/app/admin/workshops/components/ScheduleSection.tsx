'use client';

import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Weekday } from '@/types/workshop';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';
import DayScheduleInput from './DayScheduleInput';
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  FieldArrayWithId,
  UseFormGetValues,
} from 'react-hook-form';

interface ScheduleSectionProps {
  sameHoursForAllDays: boolean;
  toggleSameHours: (value: boolean) => void;
  weekDays: Weekday[];
  selectedDays: Weekday[];
  toggleDay: (day: Weekday) => void;
  sharedTimeRangesFields: FieldArrayWithId<
    WorkshopFormValues,
    'sharedTimeRanges',
    'id'
  >[];
  appendSharedTimeRange: (value: {
    start: string;
    end: string;
    location?: string;
  }) => void;
  removeSharedTimeRange: (index: number) => void;
  register: UseFormRegister<WorkshopFormValues>;
  scheduleFields: FieldArrayWithId<WorkshopFormValues, 'schedule', 'id'>[];
  removeScheduleDay: (index: number) => void;
  control: Control<WorkshopFormValues>;
  setValue: UseFormSetValue<WorkshopFormValues>;
  getValues: UseFormGetValues<WorkshopFormValues>;
  errors: FieldErrors<WorkshopFormValues>;
}

function deepScheduleEqual(
  a: WorkshopFormValues['schedule'],
  b: WorkshopFormValues['schedule']
) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].day !== b[i].day) return false;
    const aTR = a[i].timeRanges;
    const bTR = b[i].timeRanges;
    if (aTR.length !== bTR.length) return false;
    for (let j = 0; j < aTR.length; j++) {
      if (
        aTR[j].start !== bTR[j].start ||
        aTR[j].end !== bTR[j].end ||
        (aTR[j].location ?? '') !== (bTR[j].location ?? '')
      )
        return false;
    }
  }
  return true;
}

export function ScheduleSection({
  sameHoursForAllDays,
  toggleSameHours,
  weekDays,
  selectedDays,
  toggleDay,
  sharedTimeRangesFields,
  appendSharedTimeRange,
  removeSharedTimeRange,
  register,
  scheduleFields,
  removeScheduleDay,
  control,
  setValue,
  getValues,
}: ScheduleSectionProps) {
  const syncScheduleWithShared = (days: Weekday[]) => {
    const sharedTimeRanges = getValues('sharedTimeRanges');
    const newSchedule = days.map((day) => ({
      day,
      timeRanges:
        sharedTimeRanges.length > 0
          ? sharedTimeRanges
          : [{ start: '', end: '', location: '' }],
    }));

    const currentSchedule = getValues('schedule');

    if (!deepScheduleEqual(currentSchedule, newSchedule)) {
      setValue('schedule', newSchedule);
    }
  };

  useEffect(() => {
    if (sameHoursForAllDays) {
      syncScheduleWithShared(selectedDays);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays, sameHoursForAllDays]);

  return (
    <>
      <div className='flex items-center gap-2 mb-4'>
        <Checkbox
          id='sameHoursForAllDays'
          checked={sameHoursForAllDays}
          onCheckedChange={(checked: boolean) => {
            toggleSameHours(checked);
            if (checked) {
              syncScheduleWithShared(selectedDays);
            }
          }}
        />
        <Label htmlFor='sameHoursForAllDays'>
          Same hours for all selected days
        </Label>
      </div>

      <div className='space-y-2 mb-4'>
        <Label>Days of Week</Label>
        <div className='grid grid-cols-2 gap-2'>
          {weekDays.map((day) => (
            <label
              key={day}
              className='flex items-center gap-2 cursor-pointer'
              htmlFor={`day-checkbox-${day}`}
            >
              <Checkbox
                id={`day-checkbox-${day}`}
                checked={selectedDays.includes(day)}
                onCheckedChange={() => toggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      {sameHoursForAllDays ? (
        <>
          {selectedDays.length === 0 && (
            <p className='text-muted-foreground text-sm mb-2'>
              Select at least one day to add time ranges.
            </p>
          )}
          {selectedDays.length > 0 && (
            <div className='space-y-4'>
              {sharedTimeRangesFields.map((field, idx) => (
                <div key={field.id} className='flex gap-2 items-center'>
                  <Input
                    type='time'
                    {...register(`sharedTimeRanges.${idx}.start` as const)}
                  />
                  <Input
                    type='time'
                    {...register(`sharedTimeRanges.${idx}.end` as const)}
                  />
                  <Input
                    type='text'
                    placeholder='Location'
                    {...register(`sharedTimeRanges.${idx}.location` as const)}
                  />
                  <Button
                    variant='ghost'
                    onClick={() => removeSharedTimeRange(idx)}
                    type='button'
                    size='sm'
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  appendSharedTimeRange({ start: '', end: '', location: '' })
                }
              >
                + Add Time Range
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {scheduleFields.length === 0 && (
            <p className='text-muted-foreground text-sm mb-2'>
              Select at least one day to add time ranges.
            </p>
          )}
          <div className='space-y-6'>
            {scheduleFields.map((field, index) => (
              <DayScheduleInput
                key={field.id}
                dayScheduleIndex={index}
                day={field.day}
                control={control}
                register={register}
                // setValue={setValue}
                removeScheduleDay={removeScheduleDay}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
