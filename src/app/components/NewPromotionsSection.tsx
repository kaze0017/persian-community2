import BusinessesCarousel from './subComponents/BusinessesCarousel';
import { Business } from '@/types/business';
import SectionWrapper from './subComponents/SectionWrapper';

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
    <SectionWrapper title='New Promotions'>
      <BusinessesCarousel businesses={sponsored} imageOnLeft={false} />
    </SectionWrapper>
  );
}
