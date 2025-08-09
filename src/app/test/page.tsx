import React from 'react';

import HomePage from './components/HomePage';
import { getFeaturedEvents } from '@/lib/events';
import { getBusinesses } from '@/lib/businesses';
import { getFeaturedWorkshops } from '@/lib/workShops';
export default async function page() {
  const events = await getFeaturedEvents();
  const businesses = await getBusinesses();
  const workshops = await getFeaturedWorkshops();

  return (
    <HomePage events={events} businesses={businesses} workshops={workshops} />
  );
}
