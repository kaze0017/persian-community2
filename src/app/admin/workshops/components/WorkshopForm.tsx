'use client';

import React, { useEffect, useState } from 'react';
import {
  useForm,
  useFieldArray,
  FormProvider,
  useWatch,
  Resolver,
  UseFormGetValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workshopSchema,
  WorkshopFormValues,
} from '@/app/lib/validators/workshop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Weekday } from '@/types/workshop';
import { BasicInfoSection } from './BasicInfoSection';
import { ScheduleSection } from './ScheduleSection';
import { InstructorSection } from './InstructorSection';
import { PriceLanguageSection } from './PriceLanguageSection';
import { DescriptionSection } from './DescriptionSection';
import BannerSection from './BannerSection';

interface WorkshopFormProps {
  initialData?: WorkshopFormValues;
  onClose: () => void;
  onSubmit?: (data: WorkshopFormValues, bannerFile?: File | null) => void;
}

const weekDays: Weekday[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function WorkshopForm({
  initialData,
  onClose,
  onSubmit,
}: WorkshopFormProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopSchema) as Resolver<WorkshopFormValues>,
    defaultValues: {
      ...initialData,
      price: initialData?.price ?? 0,
      description: initialData?.description ?? '',
      sameHoursForAllDays: initialData?.sameHoursForAllDays ?? false,
      sharedTimeRanges: initialData?.sharedTimeRanges ?? [],
      schedule: initialData?.schedule ?? [],
      instructor: initialData?.instructor ?? {
        id: '',
        name: '',
        bio: '',
        photoUrl: '',
        linkedInUrl: '',
        linkedInId: '',
        email: '',
        connectedWithLinkedIn: false,
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = form;

  const sameHoursForAllDays = useWatch({
    control,
    name: 'sameHoursForAllDays',
  });

  const scheduleFromForm = useWatch({
    control,
    name: 'schedule',
    defaultValue: [],
  });

  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);

  useEffect(() => {
    const scheduleDays = scheduleFromForm.map((s) => s.day);
    setSelectedDays(scheduleDays);
  }, [scheduleFromForm]);

  const {
    fields: scheduleFields,
    append: appendScheduleDay,
    remove: removeScheduleDay,
  } = useFieldArray({ control, name: 'schedule' });

  const {
    fields: sharedTimeRangesFields,
    append: appendSharedTimeRange,
    remove: removeSharedTimeRange,
  } = useFieldArray({ control, name: 'sharedTimeRanges' });

  function toggleSameHours(value: boolean) {
    setValue('sameHoursForAllDays', value);
    if (value) {
      setValue('schedule', []);
      if (sharedTimeRangesFields.length === 0) {
        appendSharedTimeRange({ start: '', end: '', location: '' });
      }
      setSelectedDays([]);
    } else {
      setValue('sharedTimeRanges', []);
    }
  }

  function toggleDay(day: Weekday) {
    const isSelected = selectedDays.includes(day);
    if (isSelected) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
      if (!sameHoursForAllDays) {
        const index = scheduleFields.findIndex((s) => s.day === day);
        if (index >= 0) removeScheduleDay(index);
      }
    } else {
      setSelectedDays([...selectedDays, day]);
      if (!sameHoursForAllDays) {
        appendScheduleDay({
          day,
          timeRanges: [{ start: '', end: '', location: '' }],
        });
      }
    }
  }

  function onSubmitInternal(data: WorkshopFormValues) {
    const getScheduleForSelectedDays = (
      selectedDays: Weekday[],
      getValues: UseFormGetValues<WorkshopFormValues>
    ) => {
      const sharedTimeRanges = getValues('sharedTimeRanges');
      return selectedDays.map((day) => ({
        day,
        timeRanges: sharedTimeRanges.length
          ? sharedTimeRanges
          : [{ start: '', end: '', location: '' }],
      }));
    };

    const scheduleToSave = data.sameHoursForAllDays
      ? getScheduleForSelectedDays(selectedDays, getValues)
      : data.schedule;

    onSubmit?.(
      {
        ...data,
        schedule: scheduleToSave,
        price: data.price ? Number(data.price) : 0,
      },
      bannerFile
    );
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-lg max-h-[80vh] overflow-auto'>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Workshop' : 'New Workshop'}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmitInternal)} className='space-y-4'>
            <BasicInfoSection
              register={register}
              setValue={setValue}
              category={form.getValues('category')}
            />
            <BannerSection onFileSelected={setBannerFile} />
            <ScheduleSection
              sameHoursForAllDays={sameHoursForAllDays}
              toggleSameHours={toggleSameHours}
              weekDays={weekDays}
              selectedDays={selectedDays}
              toggleDay={toggleDay}
              sharedTimeRangesFields={sharedTimeRangesFields}
              appendSharedTimeRange={appendSharedTimeRange}
              removeSharedTimeRange={removeSharedTimeRange}
              register={register}
              scheduleFields={scheduleFields}
              removeScheduleDay={removeScheduleDay}
              control={control}
              setValue={setValue}
              getValues={getValues}
              errors={errors}
            />
            <InstructorSection
              register={register}
              errors={errors}
              setValue={setValue}
            />
            <PriceLanguageSection
              register={register}
              setValue={setValue}
              language={form.getValues('language')}
            />
            <DescriptionSection register={register} />
            <Button type='submit' className='w-full'>
              Save
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
