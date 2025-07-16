'use client';

import React, { useState } from 'react';
import GalleryDisplayWithFetch from '@/components/GalleryDisplayWithFetch';
import GalleryUploader from '@/components/GalleryUploader';
import { BusinessGalleryConfig } from '@/types/business';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  config?: BusinessGalleryConfig;
  isAdmin: boolean;
}

export default function GallerySection({ businessId, config, isAdmin }: Props) {
  const [isDisplayEnabled, setDisplayEnabled] = useState(
    config?.isDisplayEnabled ?? true
  );
  const [isUploaderEnabled] = useState(config?.isUploaderEnabled ?? true);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const toggleGalleryDisplay = async () => {
    const newValue = !isDisplayEnabled;
    setDisplayEnabled(newValue);
    setUpdating(true);

    try {
      const docRef = doc(db, 'businesses', businessId);
      await updateDoc(docRef, {
        'businessConfig.galleryConfig.isDisplayEnabled': newValue,
      });
    } catch (err) {
      console.error('Error updating gallery display setting:', err);
      // Revert local state if update fails
      setDisplayEnabled((prev) => !prev);
    } finally {
      setUpdating(false);
    }
  };
  const [refreshGallery, setRefreshGallery] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshGallery((prev) => prev + 1);
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Gallery Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable Gallery Display',
            checked: isDisplayEnabled,
            onChange: toggleGalleryDisplay,
          },
        ]}
        buttons={
          isUploaderEnabled
            ? [
                {
                  label: uploaderOpen ? 'Hide Uploader' : 'Show Uploader',
                  onClick: () => setUploaderOpen((prev) => !prev),
                },
              ]
            : []
        }
      />

      {isAdmin && uploaderOpen && isUploaderEnabled && (
        <div className='border rounded-md p-4 bg-muted'>
          <GalleryUploader
            businessId={businessId}
            onComplete={handleUploadSuccess}
          />
        </div>
      )}

      {isDisplayEnabled && (
        <GalleryDisplayWithFetch
          businessId={businessId}
          refreshTrigger={refreshGallery} // Pass refresh trigger prop
        />
      )}
    </SectionPanel>
  );
}
