'use client';
import React, { useEffect, useState } from 'react';
import {
  Info,
  Package,
  Wrench,
  Palette,
  Star,
  Phone,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { fetchBusinessById } from '../../clientReducer/clientBusinessReducer';
import { useAppSelector, useAppDispatch } from '@/app/hooks';

// Import your reusable component
import GlassTabsComponent from '@/components/glassTabsComponent/GlassTabsComponent';

// Import tab panels
import InfoTab from '../_components/InfoTab';
import ProductsTab from '../_components/ProductsTab';
import ServicesTab from '../_components/ServicesTab';
import UiTab from '../_components/UiTab';
import AboutTab from '@/app/client/businesses/_components/AboutTab';
import { GooglePlaceId } from '../_components/GooglePlaceId';

export default function GlassTabs() {
  const { businessId }: { businessId: string } = useParams();

  const { register, handleSubmit, setValue, formState } = useForm();
  const [dirty, setDirty] = useState(false);

  const dispatch = useAppDispatch();

  const selectedBusiness = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness
  );

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log('Saving...', data);
    setDirty(false);
  };

  useEffect(() => {
    if (businessId) {
      console.log('Fetching business with ID:', businessId);
      dispatch(fetchBusinessById(businessId));
    }
  }, [businessId]);

  return (
    <div className='w-full max-w-6xl mx-auto p-4 md:p-6'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='relative'
      >
        <GlassTabsComponent
          defaultValue='info'
          tabs={[
            {
              value: 'info',
              label: 'Info',
              icon: Info,
              panel: <InfoTab onSubmit={onSubmit} businessId={businessId} />,
            },
            {
              value: 'products',
              label: 'Products',
              icon: Package,
              panel: <ProductsTab businessId={businessId} />,
            },
            {
              value: 'services',
              label: 'Services',
              icon: Wrench,
              panel: <ServicesTab businessId={businessId} />,
            },
            {
              value: 'reviews',
              label: 'Reviews',
              icon: Star,
              panel: <GooglePlaceId businessId={businessId} />,
            },
            {
              value: 'about',
              label: 'About',
              icon: BookOpen,
              panel: <AboutTab businessId={businessId} />,
            },
            {
              value: 'contacts',
              label: 'Contacts',
              icon: Phone,
              panel: <UiTab />,
            },
            {
              value: 'ui',
              label: 'UI',
              icon: Palette,
              panel: <UiTab />,
            },
          ]}
        />
      </motion.div>
    </div>
  );
}
