import * as React from 'react';
import { getBusinesses } from '@/lib/businesses';
import { getFeaturedEvents } from '@/lib/events';
import FeaturedEventsSection from './components/FeaturedEventsSection';
import { HydrateBusinesses } from './components/subComponents/HydrateBusinesses';
import { HydrateEvents } from './components/subComponents/HydrateEvents';
import BusinessesCarousel from './components/subComponents/BusinessesCarousel';
import SectionWrapper from './components/subComponents/SectionWrapper';
import { Business } from '@/types/business';

export default async function Home() {
  const businessSections = [
    { condition: 'isSponsored', title: 'Sponsored Businesses' },
    { condition: 'isNew', title: 'New Businesses' },
    { condition: 'isTrusted', title: 'Trusted Businesses' },
    { condition: 'isPromotions', title: 'New Promotions' },
  ] as const;

  const businesses = await getBusinesses();
  const events = await getFeaturedEvents();

  const sections = businessSections.map(({ condition, title }) => ({
    title,
    condition,
    businesses: businesses.filter(
      (biz) => biz[condition as keyof Business] === true
    ),
  }));

  return (
    <>
      <HydrateEvents events={events}>
        <FeaturedEventsSection events={events} />
      </HydrateEvents>

      <HydrateBusinesses businesses={businesses}>
        {sections.map(({ title, businesses }, idx) =>
          businesses.length > 0 ? (
            <SectionWrapper title={title} key={title}>
              <BusinessesCarousel
                businesses={businesses}
                imageOnLeft={idx % 2 === 0}
              />
            </SectionWrapper>
          ) : null
        )}
      </HydrateBusinesses>
    </>
  );
}
