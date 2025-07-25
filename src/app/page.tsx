'use client';
import * as React from 'react';
import FeaturedEventsSection from './components/FeaturedEventsSection';
import SponsoredBusinessesCarousel from './components/SponsorsSection';
import NewBusinessesSection from './components/NewBusinessesSection';
import TrustedBusinessesSection from './components/TrustedBusinessesSection';
import NewPromotionsSection from './components/NewPromotionsSection';
export default function Home() {
  return (
    <div className='w-full'>
      <FeaturedEventsSection />
      <SponsoredBusinessesCarousel />
      <NewBusinessesSection />
      <TrustedBusinessesSection />
      <NewPromotionsSection />
    </div>
  );
}
