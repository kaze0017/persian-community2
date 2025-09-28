import SalonEditorPage from '@/app/admin/salon/[eventId]/page';
import React from 'react';

export default function EventLayoutTab({
  eventId,
  clientId,
}: {
  eventId?: string;
  clientId?: string;
}) {
  return <SalonEditorPage eventId={eventId} clientId={clientId} />;
}
