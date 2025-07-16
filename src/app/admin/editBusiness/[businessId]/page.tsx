'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BusinessForm from '../../add-business/components/BusinessForm';
import { useParams } from 'next/navigation';
import { getBusinessById, updateBusiness } from './businessServices';
import type { Business } from '@/types/business';

export type FormData = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isSponsored?: boolean;
  isTrusted?: boolean;
  isNew?: boolean;
  hasPromotions?: boolean;
};

export default function EditBusinessPage() {
  const { businessId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Business | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ownerImageFile, setOwnerImageFile] = useState<File | null>(null);
  const [businessCardFile, setBusinessCardFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!businessId) return;
    const loadData = async () => {
      const data = await getBusinessById(businessId as string);
      if (data) {
        setInitialData(data);
        reset({
          businessName: data.businessName,
          ownerName: data.ownerName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          category: data.category,
          coordinates: data.coordinates || { lat: 0, lng: 0 },
          isSponsored: data.isSponsored,
          isTrusted: data.isTrusted,
          isNew: data.isNew,
          hasPromotions: data.hasPromotions,
        });
      }
    };
    loadData();
  }, [businessId, reset]);

  const onSubmit = async (form: FormData) => {
    setLoading(true);
    await updateBusiness(businessId as string, form, {
      logoFile,
      ownerImageFile,
      businessCardFile,
    });
    setLoading(false);
    // Optionally navigate or show toast
  };
  const isBusinessOwner = true;

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Edit Business</h1>
      {initialData ? (
        <BusinessForm
          register={register}
          handleSubmit={handleSubmit}
          setValue={setValue}
          errors={errors}
          loading={loading}
          onSubmit={onSubmit}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          ownerImageFile={ownerImageFile}
          setOwnerImageFile={setOwnerImageFile}
          businessCardFile={businessCardFile}
          setBusinessCardFile={setBusinessCardFile}
          mode='edit'
          isBusinessOwner={isBusinessOwner}
          bannerImageFile={bannerImageFile}
          setBannerImageFile={setBannerImageFile}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
