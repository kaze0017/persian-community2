'use client';

import HeaderSection from '@/app/businesses/components/HeaderSection';
import AboutSection from '@/app/businesses/components/AboutSection';
import ContactSection from '@/app/businesses/components/ContactSection';
import GallerySection from '@/app/businesses/components/GallerySection';
import ServicesSection from '../../components/ServicesSection';
import AwardsSection from '../../components/AwardsSection';
import ClientsSection from '../../components/ClientsSection';
import GoogleReviewsSection from '../../components/GoogleReviewsSection';
import SectionTitle from '../../components/subComponents/SectionTitle';
import { Business } from '@/types/business';

interface Props {
  business: Business;
  businessId: string;
}

export default function ArtistTemplate({ business, businessId }: Props) {
  const isAdmin: boolean = true;

  return (
    <main className='max-w-4xl mx-auto p-6 space-y-8'>
      <HeaderSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='About Us' />
      <AboutSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='Services' />
      <ServicesSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='Gallery' />
      <GallerySection
        businessId={businessId}
        config={business.businessConfig?.galleryConfig}
        isAdmin={isAdmin}
      />

      <SectionTitle title='Awards' />
      <AwardsSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='Trusted By' />
      <ClientsSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='Google Reviews' />
      <GoogleReviewsSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
      <SectionTitle title='Contact Us' />
      <ContactSection
        businessId={businessId}
        business={business}
        isAdmin={isAdmin}
      />
    </main>
  );
}
