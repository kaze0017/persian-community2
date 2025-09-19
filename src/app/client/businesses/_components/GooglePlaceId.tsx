'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GoogleReviewEmbed from '@/app/businesses/components/subComponents/GoogleReviewEmbed';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import TabTitle from '@/components/glassTabsComponent/TabTitle';
import AddGoogleIdDialog from './_subComponents/AddGoogleIdDialog';
import {
  addOrUpdateGoogleId,
  removeGoogleId,
} from '@/app/client/clientReducer/clientBusinessReducer';

type GooglePlaceIdProps = {
  businessId: string;
};

export const GooglePlaceId = ({ businessId }: GooglePlaceIdProps) => {
  const [editing, setEditing] = useState(false);
  const business = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness
  );
  const [tempPlaceId, setTempPlaceId] = useState(
    business?.businessConfig?.googleReviewsConfig?.placeId ?? ''
  );
  const placeId = business?.businessConfig?.googleReviewsConfig?.placeId || '';
  const [updating, setUpdating] = useState(false);
  const dispatch = useAppDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);

  const handleSave = (desc: string) => {
    dispatch(addOrUpdateGoogleId(businessId, desc));
    setDialogOpen(false);
  };

  const handleDelete = () => {
    dispatch(removeGoogleId(businessId));
    setDialogOpen(false);
  };

  return (
    <>
      <TabTitle
        title='Available Services'
        hasAddBtn
        onAddType={openDialog}
        addBtnTitle='Add New Service'
      />
      <div className='mt-4 flex flex-col gap-2 sm:flex-row sm:items-center'>
        {editing ? (
          <>
            <Input
              placeholder='Enter Google Place ID'
              value={tempPlaceId}
              onChange={(e) => setTempPlaceId(e.target.value)}
              className='w-full sm:w-96'
            />
            <Button
              // onClick={handleAddPlaceId}
              disabled={updating || !tempPlaceId.trim()}
            >
              Save
            </Button>
            {placeId && (
              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={updating}
              >
                Delete
              </Button>
            )}
            <Button
              variant='ghost'
              onClick={() => {
                setTempPlaceId(placeId ?? '');
                setEditing(false);
              }}
              disabled={updating}
            >
              Cancel
            </Button>
          </>
        ) : (
          <div className='flex gap-2'>
            {placeId ? (
              <>
                <p className='text-sm text-muted-foreground'>
                  <strong>Place ID:</strong> {placeId}
                </p>
                <Button variant='outline' onClick={() => setEditing(true)}>
                  Edit
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditing(true)}>Add Place ID</Button>
            )}
          </div>
        )}
      </div>

      {/* Always show embed if placeId exists */}
      {placeId && (
        <div className='mt-4'>
          <GoogleReviewEmbed placeId={placeId} />
        </div>
      )}
      <AddGoogleIdDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
};
