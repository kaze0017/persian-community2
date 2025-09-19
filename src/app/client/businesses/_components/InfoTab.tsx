'use client';
import React, { useState, useEffect } from 'react';
import { Business } from '@/types/business';
import {
  GlassInput,
  GlassImageUpload,
} from '@/app/client/businesses/_components/GlassInputs';
import MapSelector from '@/app/admin/MapSelector';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { filter } from '@/app/components/filters/logoFilter';
import { useAppSelector } from '@/app/hooks';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import { uploadImage } from '@/services/storageService';
import { doc, updateDoc } from 'firebase/firestore';

export default function InfoTab({
  onSubmit,
  businessId,
}: {
  onSubmit: SubmitHandler<any>;
  businessId: string;
}) {
  const business = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness
  );

  const [files, setFiles] = useState<{
    owner?: File;
    logo?: File;
    banner?: File;
    card?: File;
  }>({});

  const [changed, setChanged] = useState<{
    owner: boolean;
    logo: boolean;
    banner: boolean;
    card: boolean;
  }>({ owner: false, logo: false, banner: false, card: false });

  const [dirty, setDirty] = useState(false);

  type InfoFormValues = {
    businessName: string;
    email: string;
    phone: string;
    address: string;
    coordinates: { lat?: number; lng?: number };
  };

  const { register, handleSubmit, setValue, reset } = useForm<InfoFormValues>({
    defaultValues: {
      businessName: '',
      email: '',
      phone: '',
      address: '',
      coordinates: { lat: undefined, lng: undefined },
    },
  });

  // Helper to mark form dirty on input change
  const registerWithDirty = (name: keyof InfoFormValues) => ({
    ...register(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      register(name).onChange(e);
      setDirty(true);
    },
  });

  // Delete all files in a folder (recursively)
  const deleteBusinessImages = async (
    businessId: string,
    subFolder: string
  ) => {
    try {
      const folderRef = ref(storage, `businesses/${businessId}/${subFolder}`);
      const { items, prefixes } = await listAll(folderRef);

      await Promise.all([
        ...items.map((itemRef) => deleteObject(itemRef)),
        ...prefixes.map((subRef) =>
          deleteBusinessImages(businessId, `${subFolder}/${subRef.name}`)
        ),
      ]);
    } catch (error) {
      console.error(`❌ Error deleting ${subFolder}:`, error);
    }
  };

  // Helper for image upload + deletion
  const handleImageUpdate = async (
    key: keyof typeof files,
    folder: string,
    fileName: string,
    updates: Partial<Business>,
    updateKey: keyof Business,
    transformUrl?: (url: string) => any
  ) => {
    if (changed[key] && files[key]) {
      await deleteBusinessImages(businessId, folder);
      const url = await uploadImage(
        files[key]!,
        `businesses/${businessId}/${folder}`,
        fileName
      );
      updates[updateKey] = transformUrl ? transformUrl(url) : url;
    }
  };

  // Form submit
  const handleFormSubmit: SubmitHandler<InfoFormValues> = async (data) => {
    try {
      const updates: Partial<Business> = {};

      await handleImageUpdate(
        'owner',
        'owner',
        'owner.jpg',
        updates,
        'ownerImageUrl'
      );
      await handleImageUpdate('logo', 'logo', 'logo.jpg', updates, 'logoUrl');
      await handleImageUpdate(
        'card',
        'card',
        'card.jpg',
        updates,
        'businessCardUrl'
      );
      await handleImageUpdate(
        'banner',
        'banner',
        'banner.jpg',
        updates,
        'bannerImageUrls',
        (url) => ({
          original: url,
          sizes: {
            small: url.replace('banner.jpg', 'banner_small.webp'),
            medium: url.replace('banner.jpg', 'banner_medium.webp'),
            large: url.replace('banner.jpg', 'banner_large.webp'),
            xlarge: url.replace('banner.jpg', 'banner_xlarge.webp'),
          },
        })
      );

      // Merge form data + uploaded image URLs
      const finalData: Partial<Business> = { ...data, ...updates };

      // Update Firestore
      const businessRef = doc(db, 'businesses', businessId);
      await updateDoc(businessRef, finalData);
      console.log('✅ Business updated:', finalData);

      onSubmit(finalData);
      setDirty(false);
    } catch (err) {
      console.error('❌ Failed to save changes:', err);
    }
  };

  // Set form default values when business changes
  useEffect(() => {
    if (business) {
      reset({
        businessName: business.businessName || '',
        email: business.email || '',
        phone: business.phone || '',
        address: business.address || '',
        coordinates: {
          lat: business.coordinates?.lat,
          lng: business.coordinates?.lng,
        },
      });
      setDirty(false);
    }
  }, [business, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='space-y-6 relative'
    >
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Business Info</h3>
        <p className='text-sm/6 text-muted-foreground'>
          Put your general business information here (name, description,
          contact, location, hours...).
        </p>

        {/* Inputs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <GlassInput
            label='Business Name'
            type='text'
            placeholder='Enter business name'
            {...registerWithDirty('businessName')}
          />
          <GlassInput
            label='Email'
            type='email'
            placeholder='example@email.com'
            {...registerWithDirty('email')}
          />
          <GlassInput
            label='Phone'
            type='tel'
            placeholder='+1 (555) 123-4567'
            {...registerWithDirty('phone')}
          />
          <GlassInput
            label='Address'
            type='text'
            placeholder='123 Main St'
            {...registerWithDirty('address')}
          />
        </div>

        {/* Map */}
        <MapSelector
          onChange={(coords, address) => {
            setValue('coordinates.lat', coords.lat);
            setValue('coordinates.lng', coords.lng);
            setValue('address', address || '');
            setDirty(true);
          }}
        />

        {/* Images */}
        <div className='grid gap-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <GlassImageUpload
              label='Owner Image'
              defaultImage={
                business?.ownerImageUrl || '/images/placeholders/avatar.webp'
              }
              onChange={(e) => {
                const file = e.target.files?.[0] || undefined;
                setFiles((prev) => ({ ...prev, owner: file }));
                setChanged((prev) => ({ ...prev, owner: true }));
                setDirty(true);
              }}
            />
            <GlassImageUpload
              label='Logo'
              defaultImage={
                business?.logoUrl || '/images/placeholders/logo.webp'
              }
              imgStyle={filter}
              onChange={(e) => {
                const file = e.target.files?.[0] || undefined;
                setFiles((prev) => ({ ...prev, logo: file }));
                setChanged((prev) => ({ ...prev, logo: true }));
                setDirty(true);
              }}
            />
            <GlassImageUpload
              label='Business Card'
              defaultImage={
                business?.businessCardUrl || '/images/placeholders/logo.webp'
              }
              imgStyle={filter}
              onChange={(e) => {
                const file = e.target.files?.[0] || undefined;
                setFiles((prev) => ({ ...prev, card: file }));
                setChanged((prev) => ({ ...prev, card: true }));
                setDirty(true);
              }}
            />
          </div>

          <GlassImageUpload
            label='Business Banner'
            wide
            defaultImage={
              business?.bannerImageUrls?.sizes.medium ||
              '/images/placeholders/business_banner.webp'
            }
            onChange={(e) => {
              const file = e.target.files?.[0] || undefined;
              setFiles((prev) => ({ ...prev, banner: file }));
              setChanged((prev) => ({ ...prev, banner: true }));
              setDirty(true);
            }}
          />
          <span className='text-xs text-muted-foreground'>
            Recommended size: 1200x300px
          </span>
        </div>
      </div>

      {/* Buttons */}
      {dirty && (
        <div className='sticky bottom-4 right-0 flex justify-end gap-3 px-2'>
          <Button
            type='button'
            variant='ghost'
            className='bg-white/10 backdrop-blur-md border border-white/20 text-sm shadow-lg rounded-xl'
            onClick={() => {
              reset();
              setDirty(false);
            }}
          >
            Discard Changes
          </Button>
          <Button
            type='submit'
            className='bg-white/20 backdrop-blur-md border border-white/20 text-sm shadow-lg rounded-xl'
          >
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}
