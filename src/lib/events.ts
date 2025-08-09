import { getCollection } from '@/services/firestoreService';
import { Event } from '@/types/event';

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const events = await getCollection('events') as Event[];
    return events.filter((e: Event) => true);
  } catch (err) {
    console.error('Error fetching featured events:', err);
    return [];
  }
}
