import { getBusinesses } from '@/lib/businesses';
import { HydrateBusinesses } from './subComponents/HydrateBusinesses';
import BusinessesCarousel from './subComponents/BusinessesCarousel';
import Link from 'next/link';
import SectionWrapper from './subComponents/SectionWrapper';

export default async function FeaturedBusinessesSection() {
  const businesses = await getBusinesses();
  const sponsored = businesses.filter((b) => b.isSponsored);

  if (!businesses || businesses.length === 0) {
    return <p>No businesses available.</p>;
  }

  return (
    <SectionWrapper title='New in Ottawa'>
      <HydrateBusinesses businesses={sponsored}>
        <BusinessesCarousel businesses={sponsored} imageOnLeft={false} />
      </HydrateBusinesses>
    </SectionWrapper>
  );
}
