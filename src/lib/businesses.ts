import { getCollection } from '@/services/firestoreService';
import { Business } from '@/types/business';

export async function getBusinesses(): Promise<Business[]> {
  try {
    const businesses = await getCollection('businesses');
    return businesses as Business[];
  } catch (err) {
    console.error('Error fetching businesses:', err);
    return [];
  }
}
