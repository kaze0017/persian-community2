'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import SectionPanel from './subComponents/SectionPanel';
import { uploadImage } from '@/services/storageService';
import { updateDocument } from '@/services/firestoreService';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function BusinessAboutSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialConfig = business?.businessConfig?.aboutConfig || {};

  const [ownerImageEnabled, setOwnerImageEnabled] = useState(
    initialConfig.ownerImageEnabled ?? true
  );
  const [descriptionEnabled, setDescriptionEnabled] = useState(
    initialConfig.descriptionEnabled ?? true
  );
  const [description, setDescription] = useState(
    initialConfig.description ?? ''
  );
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [ownerImageUrl, setOwnerImageUrl] = useState(
    business?.ownerImageUrl || ''
  );

  const ownerInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = async (
    field: 'ownerImageEnabled' | 'descriptionEnabled',
    value: boolean
  ) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        [`businessConfig.aboutConfig.${field}`]: value,
      });
      if (field === 'ownerImageEnabled') setOwnerImageEnabled(value);
      if (field === 'descriptionEnabled') setDescriptionEnabled(value);
    } catch (err) {
      console.error(`Error toggling ${field}:`, err);
    } finally {
      setUpdating(false);
    }
  };

  const handleOwnerImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    setUpdating(true);
    try {
      const url = await uploadImage(e.target.files[0], `owners/${businessId}`);
      await updateDocument('businesses', businessId, { ownerImageUrl: url });
      setOwnerImageUrl(url); // update local preview
    } catch (err) {
      console.error('Error uploading owner image:', err);
    } finally {
      setUpdating(false);
    }
  };

  const saveDescription = async () => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.aboutConfig.description': description,
      });

      setEditing(false);
    } catch (err) {
      console.error('Error updating description:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='About Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable Owner Image',
            checked: ownerImageEnabled,
            onChange: (val) => handleToggle('ownerImageEnabled', val),
          },
          {
            label: 'Enable Description',
            checked: descriptionEnabled,
            onChange: (val) => handleToggle('descriptionEnabled', val),
          },
        ]}
        uploads={[
          {
            label: 'Choose Image',
            inputRef: ownerInputRef,
            onChange: handleOwnerImageUpload,
          },
        ]}
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {ownerImageEnabled && (
          <div className='flex flex-col items-center text-center gap-2'>
            {ownerImageUrl ? (
              <Image
                src={ownerImageUrl}
                alt='Owner'
                width={120}
                height={120}
                className='rounded-full border shadow object-cover'
              />
            ) : (
              <div className='w-28 h-28 bg-muted rounded-full flex items-center justify-center text-muted-foreground'>
                No Image
              </div>
            )}
            <p className='text-sm font-medium'>
              {business?.ownerName || 'Owner Name'}
            </p>
          </div>
        )}

        {descriptionEnabled && (
          <div>
            <h3 className='text-md font-semibold mb-2'>Description</h3>
            {isAdmin && editing ? (
              <div className='flex flex-col gap-2'>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='min-h-[120px] w-full p-2 border rounded-md text-sm'
                  placeholder='Write about the business...'
                  disabled={updating}
                />
                <Button size='sm' onClick={saveDescription} disabled={updating}>
                  Save
                </Button>
              </div>
            ) : isAdmin ? (
              <div className='flex flex-col gap-2'>
                <p className='text-sm text-muted-foreground whitespace-pre-line'>
                  {description || 'No description yet.'}
                </p>
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => setEditing(true)}
                  disabled={updating}
                >
                  Edit Description
                </Button>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground whitespace-pre-line'>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </SectionPanel>
  );
}
