import BusinessesCarousel from './subComponents/BusinessesCarousel';
import SectionWrapper from './subComponents/SectionWrapper';
import { Business } from '@/types/business';

export default function FeaturedBusinessesSection({
  businesses,
}: {
  businesses: Business[];
}) {
  if (!businesses || businesses.length === 0) {
    return <p>No businesses available.</p>;
  }

  const sponsored = businesses.filter((b) => b.isSponsored);

  if (sponsored.length === 0) {
    return <p>No sponsored businesses available.</p>;
  }

  return (
    <SectionWrapper title='Sponsors'>
      <BusinessesCarousel businesses={sponsored} imageOnLeft={true} />
    </SectionWrapper>
  );
}
