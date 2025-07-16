'use client';

import { useState, useRef } from 'react';

import Image from 'next/image';
import { Business } from '@/types/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionPanel from './subComponents/SectionPanel';
import { uploadImage } from '@/services/storageService';
import { updateDocument } from '@/services/firestoreService';
import AdminControlsPanel from './subComponents/AdminControlsPanel';

interface Props {
  businessId: string;
  business?: Business;
  isAdmin: boolean;
}

export default function HeaderSection({
  businessId,
  business,
  isAdmin,
}: Props) {
  const initialHeaderConfig = business?.businessConfig?.headerConfig || {};

  const [logoEnabled, setLogoEnabled] = useState(
    initialHeaderConfig.logoEnabled ?? true
  );
  const [bannerEnabled, setBannerEnabled] = useState(
    initialHeaderConfig.bannerEnabled ?? true
  );
  const [slogan, setSlogan] = useState(initialHeaderConfig.slogan ?? '');
  const [editingSlogan, setEditingSlogan] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '');
  const [bannerImageUrl, setBannerImageUrl] = useState(
    business?.bannerImageUrl || ''
  );
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Persist toggle changes for logoEnabled and bannerEnabled
  const updateHeaderConfigField = async (
    field: keyof typeof initialHeaderConfig,
    value: boolean | string
  ) => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        [`businessConfig.headerConfig.${field}`]: value,
      });
      if (field === 'logoEnabled') setLogoEnabled(value as boolean);
      if (field === 'bannerEnabled') setBannerEnabled(value as boolean);
    } catch (err) {
      console.error(`Error updating headerConfig.${field}:`, err);
    } finally {
      setUpdating(false);
    }
  };

  // Handlers for toggles that update Firestore and local state
  const handleToggleLogo = () => {
    updateHeaderConfigField('logoEnabled', !logoEnabled);
  };

  const handleToggleBanner = () => {
    updateHeaderConfigField('bannerEnabled', !bannerEnabled);
  };

  // Upload new logo, update Firestore logoUrl
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUpdating(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file, `logos/${businessId}`);
      await updateDocument('businesses', businessId, { logoUrl: url });
      setLogoUrl(url); // Update local state
    } catch (err) {
      console.error('Error uploading logo:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Upload new banner, update Firestore bannerImageUrl
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUpdating(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file, `banners/${businessId}`);
      await updateDocument('businesses', businessId, { bannerImageUrl: url });
      setBannerImageUrl(url); // Update local state
    } catch (err) {
      console.error('Error uploading banner:', err);
    } finally {
      setUpdating(false);
    }
  };
  // Save slogan in nested headerConfig.slogan
  const saveSlogan = async () => {
    setUpdating(true);
    try {
      await updateDocument('businesses', businessId, {
        'businessConfig.headerConfig.slogan': slogan,
      });

      setEditingSlogan(false);
    } catch (err) {
      console.error('Error updating slogan:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Banner Settings'
        updating={updating}
        toggles={[
          {
            label: 'Enable Logo/Tabs',
            checked: logoEnabled,
            onChange: handleToggleLogo,
          },
          {
            label: 'Enable Banner',
            checked: bannerEnabled,
            onChange: handleToggleBanner,
          },
        ]}
        uploads={[
          {
            label: 'Choose Logo',
            inputRef: logoInputRef,
            onChange: handleLogoUpload,
          },
          {
            label: 'Choose Banner',
            inputRef: bannerInputRef,
            onChange: handleBannerUpload,
          },
        ]}
      />

      {logoEnabled && (
        <div className='flex items-center justify-between px-6 pt-2 flex-wrap gap-4'>
          {logoUrl && (
            <Image
              src={logoUrl}
              alt='Logo'
              width={64}
              height={64}
              className='object-cover rounded-full'
            />
          )}

          <div className='flex gap-2 ml-auto'>
            {['About', 'Gallery', 'Contact'].map((label) => (
              <Button
                key={label}
                variant='ghost'
                size='sm'
                asChild
                className='text-muted-foreground hover:text-primary'
              >
                <a href={`#${label.toLowerCase()}`}>{label}</a>
              </Button>
            ))}
          </div>
        </div>
      )}

      {bannerEnabled && (
        <div className='relative h-56 w-full'>
          <Image
            src={bannerImageUrl || '/default-banner.jpg'}
            alt='Banner'
            fill
            className='object-cover rounded-b-xl'
            priority
          />
          <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4'>
            <h1 className='text-3xl font-bold'>{business?.businessName}</h1>

            {isAdmin ? (
              editingSlogan ? (
                <div className='mt-2 flex flex-col sm:flex-row items-center gap-2'>
                  <Input
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder='Slogan'
                    className='w-64'
                    disabled={updating}
                  />
                  <Button size='sm' onClick={saveSlogan} disabled={updating}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant='link'
                  size='sm'
                  className='mt-2 italic text-white underline'
                  onClick={() => setEditingSlogan(true)}
                >
                  {slogan || 'Add Slogan'}
                </Button>
              )
            ) : (
              slogan && <p className='text-sm italic mt-1'>{slogan}</p>
            )}
          </div>
        </div>
      )}
    </SectionPanel>
  );
}
