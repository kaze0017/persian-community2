'use client';

import { useState } from 'react';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { updateDocument } from '@/services/firestoreService';
import SectionPanel from './subComponents/SectionPanel';
import { Input } from '@/components/ui/input';
import GoogleReviewEmbed from './subComponents/GoogleReviewEmbed';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function GoogleReviewsSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = business?.businessConfig?.googleReviewsConfig || {};
  const [enabled, setEnabled] = useState(initialConfig.isEnabled ?? true);
  const [placeId, setPlaceId] = useState(initialConfig.placeId || '');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [tempPlaceId, setTempPlaceId] = useState(placeId);

  const handleToggle = async (value: boolean) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.googleReviewsConfig.isEnabled': value,
      });

      setEnabled(value);
    } catch (err) {
      console.error('Failed to toggle Google Reviews:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSavePlaceId = async () => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.googleReviewsConfig.placeId': tempPlaceId,
      });

      setPlaceId(tempPlaceId);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update placeId:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Google Reviews Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable',
            checked: enabled,
            onChange: handleToggle,
          },
        ]}
        buttons={[
          {
            label: 'Set Place ID',
            onClick: () => {
              setEditing(true);
              setTempPlaceId(placeId);
            },
            disabled: updating,
          },
        ]}
      />

      {editing && (
        <div className='flex flex-col sm:flex-row items-center gap-2 mt-4'>
          <Input
            placeholder='Enter Google Place ID'
            value={tempPlaceId}
            onChange={(e) => setTempPlaceId(e.target.value)}
            className='w-full sm:w-96'
          />
          <Button
            onClick={handleSavePlaceId}
            disabled={updating || !tempPlaceId}
          >
            Save
          </Button>
          <Button
            variant='ghost'
            onClick={() => setEditing(false)}
            disabled={updating}
          >
            Cancel
          </Button>
        </div>
      )}

      {isAdmin && enabled && placeId && (
        <p className='mt-4 text-sm text-muted-foreground'>
          <strong>Place ID:</strong> {placeId}
        </p>
      )}
      {enabled && placeId && <GoogleReviewEmbed placeId={placeId} />}
    </SectionPanel>
  );
}
