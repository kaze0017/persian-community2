'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { Business } from '@/types/business';

export function HydrateBusinesses({
  businesses,
  children,
}: {
  businesses: Business[];
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({
      type: 'businesses/fetchBusinesses/fulfilled',
      payload: businesses,
    });
  }, [dispatch, businesses]);

  return <>{children}</>;
}
