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
    { condition: 'isSponsored', title: 'New Promotions' },
  ] as const;

  const businesses = await getBusinesses();
  const events = await getFeaturedEvents();

  return (
    <>
      <HydrateEvents events={events}>
        <FeaturedEventsSection events={events} />
      </HydrateEvents>

      <HydrateBusinesses businesses={businesses}>
        {businessSections.map(({ condition, title }, idx) => (
          <SectionWrapper title={title} key={condition + idx}>
            <BusinessesCarousel
              businesses={businesses.filter(
                (biz) => biz[condition as keyof Business] === true
              )}
              imageOnLeft={idx % 2 === 0}
            />
          </SectionWrapper>
        ))}
      </HydrateBusinesses>
    </>
  );
}
