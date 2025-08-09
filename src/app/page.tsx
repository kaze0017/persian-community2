import * as React from 'react';
import { getFeaturedEvents } from '@/lib/events';
import { getBusinesses } from '@/lib/businesses';
import { getFeaturedWorkshops } from '@/lib/workShops';
import FeaturedEventsSection from './components/FeaturedEventsSection';
import { HydrateBusinesses } from './components/subComponents/HydrateBusinesses';
import { HydrateEvents } from './components/subComponents/HydrateEvents';
import BusinessesCarousel from './components/subComponents/BusinessesCarousel';
import SectionWrapper from './components/subComponents/SectionWrapper';
import { Business } from '@/types/business';
import HomePage from './test/components/HomePage';

export default async function Home() {
  const businessSections = [
    { condition: 'isSponsored', title: 'Sponsored Businesses' },
    { condition: 'isNew', title: 'New Businesses' },
    { condition: 'isTrusted', title: 'Trusted Businesses' },
    { condition: 'isPromotions', title: 'New Promotions' },
  ] as const;

  const businesses = await getBusinesses();
  const events = await getFeaturedEvents();
  const workShops = await getFeaturedWorkshops();

  const sections = businessSections.map(({ condition, title }) => ({
    title,
    condition,
    businesses: businesses.filter(
      (biz) => biz[condition as keyof Business] === true
    ),
  }));

  return (
    <HydrateEvents events={events}>
      <HydrateBusinesses businesses={businesses}>
        <HomePage
          events={events}
          businesses={businesses}
          workshops={workShops}
        />
      </HydrateBusinesses>
    </HydrateEvents>
  );
}

{
  /* </HydrateEvents> */
}
{
  {
    /* <FeaturedEventsSection events={events} /> */
  }
  /* {sections.map(({ title, businesses }, idx) =>
          businesses.length > 0 ? (
            <SectionWrapper title={title} key={title}>
              <BusinessesCarousel
                businesses={businesses}
                imageOnLeft={idx % 2 === 0}
                />
            </SectionWrapper>
          ) : null
        )} */
}
//   </HydrateEvents>
// </HydrateBusinesses>
