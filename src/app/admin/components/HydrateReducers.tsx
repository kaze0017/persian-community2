import React from 'react';
import { useAppDispatch } from '@/app/hooks';
import { fetchBusinesses } from '@/app/lib/businessesSlice';
import { fetchWorkshops } from '../workshops/workshopSlice';
// import { fetchEvents } from '../events/reducer/eventsSlice';

export default function HydrateReducers({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchBusinesses());
    dispatch(fetchWorkshops());
    // dispatch(fetchEvents());
  }, [dispatch]);

  return <>{children}</>;
}
