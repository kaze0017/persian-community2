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
import Link from 'next/link';
import { Banner } from '@/types/banner';
import { serverTimestamp } from 'firebase/firestore';

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

  // ✅ Support new Banner type
  const [bannerUrls, setBannerUrls] = useState<Banner | null>(
    business?.bannerImageUrls || null
  );

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  const handleToggleLogo = () =>
    updateHeaderConfigField('logoEnabled', !logoEnabled);
  const handleToggleBanner = () =>
    updateHeaderConfigField('bannerEnabled', !bannerEnabled);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'banner'
  ) => {
    if (!e.target.files?.[0]) return;
    setUpdating(true);
    try {
      const file = e.target.files[0];

      if (type === 'logo') {
        const url = (
          await uploadImage(file, `businesses/${businessId}/logo`, 'logo.jpg')
        ).replace('logo.jpg', 'logo.webp');
        await updateDocument('businesses', businessId, { logoUrl: url });
        setLogoUrl(url);
      } else {
        const originalUrl = await uploadImage(
          file,
          `businesses/${businessId}/banner`,
          'banner.jpg'
        );

        // ✅ Build Banner object with responsive sizes
        const bannerData: Banner = {
          original: originalUrl.replace('banner.jpg', 'banner.webp'),
          sizes: {
            small: originalUrl.replace('banner.jpg', 'banner_small.webp'),
            medium: originalUrl.replace('banner.jpg', 'banner_medium.webp'),
            large: originalUrl.replace('banner.jpg', 'banner_large.webp'),
            xlarge: originalUrl.replace('banner.jpg', 'banner_xlarge.webp'),
          },
        };

        await updateDocument('businesses', businessId, {
          bannerImageUrls: bannerData,
        });
        setBannerUrls(bannerData);
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
    } finally {
      setUpdating(false);
    }
  };

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
            onChange: (e) => handleImageUpload(e, 'logo'),
          },
          {
            label: 'Choose Banner',
            inputRef: bannerInputRef,
            onChange: (e) => handleImageUpload(e, 'banner'),
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
                <Link href={`#${label.toLowerCase()}`}>{label}</Link>
              </Button>
            ))}
          </div>
        </div>
      )}

      {bannerEnabled && (
        <div className='relative h-56 w-full'>
          <Image
            src={
              bannerUrls?.sizes.large ||
              bannerUrls?.sizes.medium ||
              bannerUrls?.original || // ✅ Fallback for old data
              '/default-banner.jpg'
            }
            alt='Banner'
            fill
            className='object-cover rounded-b-xl'
            priority
            sizes='(max-width: 768px) 100vw, 100vw'
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
