'use client';

import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { deleteUserEvent } from '../../clientEventsReducer';
import { useRouter } from 'next/navigation';

export default function EventDeleteTab({
  clientId,
  eventId,
}: {
  clientId: string;
  eventId: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onDeleted = () => {
    dispatch(deleteUserEvent({ clientId, eventId: eventId }));
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      // Delete user-specific event doc
      const userEventRef = doc(db, 'users', clientId, 'events', eventId);
      await deleteDoc(userEventRef);

      // Delete global event doc
      const globalEventRef = doc(db, 'events', eventId);
      await deleteDoc(globalEventRef);

      console.log('✅ Event deleted:', eventId);
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error('❌ Failed to delete event:', err);
    } finally {
      setLoading(false);
      setConfirming(false);
      router.push('/client/events');
    }
  };

  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold flex items-center gap-2 text-red-600'>
        <AlertTriangle className='w-5 h-5' />
        Delete Event
      </h3>
      <p className='text-sm text-muted-foreground'>
        Deleting this event is <strong>permanent</strong> and cannot be undone.
        All event data, tickets, and configurations will be lost.
      </p>

      {!confirming ? (
        <Button variant='destructive' onClick={() => setConfirming(true)}>
          Delete Event
        </Button>
      ) : (
        <div className='space-y-3'>
          <p className='text-sm font-medium text-red-600'>
            Are you sure you want to delete this event? This action is
            permanent.
          </p>
          <div className='flex gap-3'>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
            </Button>
            <Button
              variant='outline'
              onClick={() => setConfirming(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
