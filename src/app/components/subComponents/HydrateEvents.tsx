'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { Event } from '@/types/event';

export function HydrateEvents({
  events,
  children,
}: {
  events: Event[];
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({ type: 'events/fetchEvents/fulfilled', payload: events });
  }, [dispatch, events]);

  return <>{children}</>;
}
