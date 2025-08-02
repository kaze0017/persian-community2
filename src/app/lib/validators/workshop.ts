import { z } from 'zod';

const WeekdayEnum = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

const TimeRangeSchema = z.object({
  start: z.string().min(1, 'Start time is required'),
  end: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
});

const ScheduleDaySchema = z.object({
  day: WeekdayEnum,
  timeRanges: z.array(TimeRangeSchema).min(1),
});

const personSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Instructor name is required'),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  linkedInUrl: z.string().optional(),
  linkedInId: z.string().optional(),
  email: z.string().email().optional(),
  connectedWithLinkedIn: z.boolean().optional(),

});

export const workshopSchema = z
  .object({
    title: z.string().min(1),
    category: z.enum(['Language', 'Career', 'Tech', 'Health', 'Other']),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    sameHoursForAllDays: z.boolean().default(false),
    sharedTimeRanges: z.array(TimeRangeSchema).default([]),
    schedule: z.array(ScheduleDaySchema).default([]),
    instructor: personSchema,
    price: z.number().int().min(0).default(0),
    language: z.enum(['English', 'French', 'Farsi', 'Other']).optional(),
    capacity: z.number().int().min(1).optional(),
    description: z.string().optional(),
    bannerUrl: z.string().optional(),

    // For the form only, not part of Workshop type
    bannerFile: z
      .any()
      .refine((val) => val === null || val instanceof FileList, {
        message: 'bannerFile must be a FileList or null',
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => new Date(data.startDate) <= new Date(data.endDate),
    {
      message: 'End date must be the same or after start date',
      path: ['endDate'],
    }
  );

export type WorkshopFormValues = z.infer<typeof workshopSchema>;
export type WorkshopFormValuesStrict = z.output<typeof workshopSchema>;
