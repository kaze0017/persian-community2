'use client';

import { use } from 'react';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchBusinessById } from '@/app/lib/businessesSlice';
import ArtistTemplate from '@/app/businesses/[businessId]/templates/ArtistTemplate';
import RestaurantTemplate from '@/app/businesses/[businessId]/templates/RestaurantTemplate';

interface Props {
  params: Promise<{ businessId: string }>;
}

export default function BusinessPage({ params }: Props) {
  const { businessId } = use(params); // ✅ unwrap Promise using use()

  const dispatch = useAppDispatch();
  const { selectedBusiness, loading, error } = useAppSelector(
    (state) => state.businesses
  );

  useEffect(() => {
    if (!selectedBusiness || selectedBusiness.id !== businessId) {
      dispatch(fetchBusinessById(businessId));
    }
    // 👇 Only depend on businessId and dispatch
  }, [dispatch, businessId]);

  if (loading || !selectedBusiness) {
    return <div className='p-4'>Loading business...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>Error: {error}</div>;
  }

  const isAdmin = false;

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

    default:
      content = (
        <div className='p-4 text-muted-foreground'>
          Business category not supported.
        </div>
      );
  }

  return <>{content}</>;
}
