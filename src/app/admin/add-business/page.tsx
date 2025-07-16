'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import BusinessForm from './components/BusinessForm';
import PanelHeader from '@/components/PanelHeader';

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

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const docRef = await addDoc(collection(db, 'businesses'), {
        ...data,
      });

      const businessId = docRef.id;

      const ownerImageUrl = ownerImageFile
        ? await uploadImage(ownerImageFile, `businesses/${businessId}/owner`)
        : null;

      const businessCardUrl = businessCardFile
        ? await uploadImage(businessCardFile, `businesses/${businessId}/card`)
        : null;

      const logoUrl = logoFile
        ? await uploadImage(logoFile, `businesses/${businessId}/logo`)
        : null;

      const bannerImageUrl = bannerImageFile
        ? await uploadImage(bannerImageFile, `businesses/${businessId}/banner`)
        : null;

      await updateDoc(doc(db, 'businesses', businessId), {
        ownerImageUrl,
        businessCardUrl,
        logoUrl,
        bannerImageUrl, // NEW
      });

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
