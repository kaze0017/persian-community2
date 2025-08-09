import { getCollection } from '@/services/firestoreService';
import { Workshop } from '@/types/workshop';

export async function getFeaturedWorkshops(): Promise<Workshop[]> {
  try {
    const workshops = await getCollection('workshops') as Workshop[];
    return workshops.filter((e: Workshop) => true);
  } catch (err) {
    console.error('Error fetching featured workshops:', err);
    return [];
  }
}
