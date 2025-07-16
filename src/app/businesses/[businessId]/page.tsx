'use client';

import { use } from 'react';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchBusinessById } from '@/app/lib/businessesSlice';
import ArtistTemplate from '@/app/businesses/[businessId]/templates/ArtistTemplate';
import RestaurantTemplate from '@/app/businesses/[businessId]/templates/RestaurantTemplate';
import TechTemplate from '@/app/businesses/[businessId]/templates/TechTemplate';

interface Props {
  params: Promise<{ businessId: string }>;
}

export default function BusinessPage({ params }: Props) {
  const { businessId } = use(params);

  const dispatch = useAppDispatch();
  const { selectedBusiness, loading, error } = useAppSelector(
    (state) => state.businesses
  );
  useEffect(() => {
    if (!selectedBusiness?.id || selectedBusiness.id !== businessId) {
      dispatch(fetchBusinessById(businessId));
    }
  }, [dispatch, businessId]);

  if (loading || !selectedBusiness) {
    return <div className='p-4'>Loading business...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>Error: {error}</div>;
  }

  const isAdmin = false;

  console.log('Business Category:', selectedBusiness.category);
  let content;
  switch (selectedBusiness.category?.toLocaleLowerCase()) {
    case 'art':
      content = (
        <ArtistTemplate business={selectedBusiness} businessId={businessId} />
      );
      break;

    case 'restaurant':
      content = (
        <RestaurantTemplate
          businessId={businessId}
          isAdmin={isAdmin}
          business={selectedBusiness}
        />
      );
      break;
    case 'tech services':
      content = (
        <TechTemplate
          businessId={businessId}
          isAdmin={isAdmin}
          business={selectedBusiness}
        />
      );
      break;

    default:
      content = (
        <div className='p-4 text-muted-foreground'>
          Business category not supported.
          <br />
          Business Category: {selectedBusiness.category}
        </div>
      );
  }

  return <>{content}</>;
}
