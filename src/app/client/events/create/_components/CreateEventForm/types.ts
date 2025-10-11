import { Event } from '@/types/event';

export type CreateEventFormValues = Omit<Event, 'id'>;
