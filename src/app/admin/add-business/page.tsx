'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BusinessForm from './components/BusinessForm';
import PanelHeader from '@/components/PanelHeader';
import { uploadImage } from '@/services/storageService';
import { Banner } from '@/types/banner';

export type FormData = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  isSponsored?: boolean;
  hasPromotions?: boolean;
  isTrusted?: boolean;
  isNew?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export default function AddBusinessPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [ownerImageFile, setOwnerImageFile] = useState<File | null>(null);
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccessMessage('');

    try {
      // 1️⃣ Add initial business doc
      const docRef = await addDoc(collection(db, 'businesses'), {
        ...data,
      });

      const businessId = docRef.id;

      // 2️⃣ Prepare files list
      const imageFiles = [
        {
          key: 'ownerImageUrl',
          file: ownerImageFile,
          path: 'owner',
          name: 'profile.jpg',
          optName: 'profile.webp',
        },
        {
          key: 'businessCardUrl',
          file: businessCardFile,
          path: 'card',
          name: 'card.jpg',
          optName: 'card.webp',
        },
        {
          key: 'logoUrl',
          file: logoFile,
          path: 'logo',
          name: 'logo.jpg',
          optName: 'logo.webp',
        },
        {
          key: 'bannerImageUrls',
          file: bannerImageFile,
          path: 'banner',
          name: 'banner.jpg',
          optName: 'banner.webp',
        },
      ];

      // 3️⃣ Mixed URL object
      const urls: Record<string, string | Banner | null> = {};

      for (const { key, file, path, name, optName } of imageFiles) {
        if (key === 'bannerImageUrls') {
          if (file) {
            const originalUrl = await uploadImage(
              file,
              `businesses/${businessId}/${path}`,
              name
            );

            const bannerUrls: Banner = {
              original: originalUrl.replace(name, optName),
              sizes: {
                small: originalUrl.replace(name, 'banner_small.webp'),
                medium: originalUrl.replace(name, 'banner_medium.webp'),
                large: originalUrl.replace(name, 'banner_large.webp'),
                xlarge: originalUrl.replace(name, 'banner_xlarge.webp'),
              },
              createdAt: Date.now(),
            };

            urls[key] = bannerUrls;
          } else {
            urls[key] = null;
          }
        } else {
          urls[key] = file
            ? (
                await uploadImage(
                  file,
                  `businesses/${businessId}/${path}`,
                  name
                )
              ).replace(name, optName)
            : null;
        }
      }

      // 4️⃣ Update doc with image URLs
      await updateDoc(doc(db, 'businesses', businessId), urls);

      // ✅ Success
      setSuccessMessage('Business added successfully!');
      reset();
      setOwnerImageFile(null);
      setBusinessCardFile(null);
      setLogoFile(null);
      setBannerImageFile(null);
    } catch (error) {
      console.error('Error adding business:', error);
      alert('Failed to add business. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <PanelHeader title='Add New Business' />
      <BusinessForm
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        errors={errors}
        loading={loading}
        onSubmit={onSubmit}
        ownerImageFile={ownerImageFile}
        setOwnerImageFile={setOwnerImageFile}
        businessCardFile={businessCardFile}
        setBusinessCardFile={setBusinessCardFile}
        logoFile={logoFile}
        setLogoFile={setLogoFile}
        bannerImageFile={bannerImageFile}
        setBannerImageFile={setBannerImageFile}
      />
      {successMessage && (
        <p className='mt-4 text-green-600 font-semibold'>{successMessage}</p>
      )}
    </div>
  );
}
