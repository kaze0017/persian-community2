'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import BusinessForm from './components/BusinessForm';
import PanelHeader from '@/components/PanelHeader';
import { uploadImage } from '@/services/storageService';

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
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null); // NEW

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // const uploadImage = async (file: File, path: string): Promise<string> => {
  //   const fileName = `${Date.now()}_${file.name}`;
  //   const storageRef = ref(storage, `${path}/${fileName}`);
  //   const snapshot = await uploadBytes(storageRef, file);
  //   return await getDownloadURL(snapshot.ref);
  // };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const docRef = await addDoc(collection(db, 'businesses'), {
        ...data,
      });

      const businessId = docRef.id;

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
          key: 'bannerImageUrl',
          file: bannerImageFile,
          path: 'banner',
          name: 'banner.jpg',
          optName: 'banner.webp',
        },
      ];

      const urls: Record<string, string | null> = {};

      for (const { key, file, path, name, optName } of imageFiles) {
        urls[key] = file
          ? (
              await uploadImage(file, `businesses/${businessId}/${path}`, name)
            ).replace(name, optName)
          : null;
      }

      await updateDoc(doc(db, 'businesses', businessId), urls);

      await updateDoc(doc(db, 'businesses', businessId), urls);

      setSuccessMessage('Business added successfully!');
      reset();
      setOwnerImageFile(null);
      setBusinessCardFile(null);
      setLogoFile(null);
      setBannerImageFile(null); // NEW
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
        bannerImageFile={bannerImageFile} // NEW
        setBannerImageFile={setBannerImageFile} // NEW
      />
      {successMessage && (
        <p className='mt-4 text-green-600 font-semibold'>{successMessage}</p>
      )}
    </div>
  );
}
