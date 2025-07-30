import BusinessesCarousel from './subComponents/BusinessesCarousel';
import SectionWrapper from './subComponents/SectionWrapper';
import { Business } from '@/types/business';
export default function FeaturedBusinessesSection({
  businesses,
}: {
  businesses: Business[];
}) {
  const sponsored = businesses.filter((b) => b.isSponsored);

  if (!businesses || businesses.length === 0) {
    return <p>No businesses available.</p>;
  }

  return (
    <SectionWrapper title='Trusted by us'>
      <BusinessesCarousel businesses={sponsored} imageOnLeft={true} />
    </SectionWrapper>
  );
}
