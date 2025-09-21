'use client';

import { useState } from 'react';
import { Business, BusinessService } from '@/types/business';
import { updateDocument, getDocument } from '@/services/firestoreService';

import SectionPanel from './subComponents/SectionPanel';
import AddServiceForm from './subComponents/AddServiceForm';
import ServiceCard from './subComponents/ServiceCard';
import AdminControlsPanel from './subComponents/AdminControlsPanel';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';

interface Props {
  services: BusinessService[];
}

export default function ServicesSection({ services }: Props) {
  console.log('ServicesSection services:', services);

  return (
    <GlassPanel>
      {services.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isAdmin={false}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </GlassPanel>
  );
}
