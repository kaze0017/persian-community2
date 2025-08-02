import { Workshop } from '@/types/workshop';
import { WorkshopFormValues } from '@/app/lib/validators/workshop';

export function mapWorkshopToFormValues(
  workshop: Workshop
): WorkshopFormValues {
  return {
    title: workshop.title ?? '',
    category: workshop.category ?? 'Language',
    startDate: workshop.startDate ?? '',
    endDate: workshop.endDate ?? '',
    sameHoursForAllDays: workshop.sameHoursForAllDays ?? true,
    sharedTimeRanges: (workshop.sharedTimeRanges ?? []).map((tr) => ({
      start: tr.start ?? '',
      end: tr.end ?? '',
      location: tr.location ?? '',
    })),
    schedule: (workshop.schedule ?? []).map((s) => ({
      day: s.day,
      timeRanges: (s.timeRanges ?? []).map((tr) => ({
        start: tr.start ?? '',
        end: tr.end ?? '',
        location: tr.location ?? '',
      })),
    })),
    bannerUrl: workshop.bannerUrl ?? '',
   instructor: workshop.instructor
  ? {
      ...workshop.instructor,

    }
  : {
      id: '',
      name: '',
      bio: '',
      photoUrl: '',
      linkedInUrl: '',
      linkedInId: '',
      email: '',
      connectedWithLinkedIn: false,
    },
    price: workshop.price ?? 0,
    language: workshop.language ?? 'English',
    description: workshop.description ?? '',
    capacity: workshop.capacity ?? undefined,
  };
}
