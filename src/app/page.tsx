import * as React from 'react';
import { getBusinesses } from '@/lib/businesses';
import { getFeaturedEvents } from '@/lib/events';
import FeaturedEventsSection from './components/FeaturedEventsSection';
import SponsoredBusinessesCarousel from './components/SponsorsSection';
import NewBusinessesSection from './components/NewBusinessesSection';
import TrustedBusinessesSection from './components/TrustedBusinessesSection';
import NewPromotionsSection from './components/NewPromotionsSection';
import { HydrateBusinesses } from './components/subComponents/HydrateBusinesses';
import { HydrateEvents } from './components/subComponents/HydrateEvents';
export default async function Home() {
  const businesses = await getBusinesses();
  const events = await getFeaturedEvents();
  return (
    <>
      <HydrateEvents events={events}>
        <FeaturedEventsSection events={events} />
      </HydrateEvents>
      <HydrateBusinesses businesses={businesses}>
        <SponsoredBusinessesCarousel businesses={businesses} />
        <NewBusinessesSection businesses={businesses} />
        <TrustedBusinessesSection businesses={businesses} />
        <NewPromotionsSection businesses={businesses} />
      </HydrateBusinesses>
    </>
  );
}
