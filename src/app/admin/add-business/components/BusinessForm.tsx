'use client';

import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetValue,
} from 'react-hook-form';
import { FormData } from '../page';
import { Button } from '@/components/ui/button';
import ImageUploaderWithPreview from './ImageUploaderWithPreview';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchCategories } from '@/app/lib/categoriesSlice';
import MapSelector from '../../MapSelector';

type Props = {
  register: UseFormRegister<FormData>;
  handleSubmit: UseFormHandleSubmit<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
  loading: boolean;
  logoFile: File | null;
  setLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSubmit: (data: FormData) => void;
  ownerImageFile: File | null;
  setOwnerImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  businessCardFile: File | null;
  setBusinessCardFile: React.Dispatch<React.SetStateAction<File | null>>;
  bannerImageFile: File | null; // NEW
  setBannerImageFile: React.Dispatch<React.SetStateAction<File | null>>; // NEW
  mode?: 'add' | 'edit';
  isBusinessOwner?: boolean;
};

export default function BusinessForm({
  register,
  handleSubmit,
  setValue,
  errors,
  loading,
  onSubmit,
  ownerImageFile,
  logoFile,
  setLogoFile,
  setOwnerImageFile,
  businessCardFile,
  setBusinessCardFile,
  bannerImageFile, // NEW
  setBannerImageFile, // NEW
  mode = 'add',
}: Props) {
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [categories.length, dispatch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Text inputs */}
      {[
        {
          name: 'businessName',
          label: 'Business Name',
          type: 'text',
          required: 'Business name is required',
        },
        {
          name: 'ownerName',
          label: 'Owner Name',
          type: 'text',
          required: 'Owner name is required',
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'tel',
          required: 'Phone is required',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: 'Email is required',
        },
        {
          name: 'address',
          label: 'Address',
          type: 'text',
          required: 'Address is required',
        },
      ].map(({ name, label, type, required }) => (
        <div key={name} className='md:flex md:items-center md:space-x-4'>
          <label htmlFor={name} className='md:w-40 font-semibold'>
            {label}
          </label>
          <input
            id={name}
            type={type}
            {...register(name as keyof FormData, { required })}
            className='flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400'
          />
          {errors[name as keyof FormData] && (
            <p className='text-red-600 mt-1 md:mt-0 md:ml-4 text-sm'>
              {errors[name as keyof FormData]?.message}
            </p>
          )}
        </div>
      ))}

      {/* Map Selector */}
      <MapSelector
        onChange={(coords, address) => {
          setValue('coordinates.lat', coords.lat);
          setValue('coordinates.lng', coords.lng);
          setValue('address', address || '');
        }}
      />

      {/* Category select */}
      <div className='md:flex md:items-center md:space-x-4'>
        <label htmlFor='category' className='md:w-40 font-semibold'>
          Category
        </label>
        <select
          disabled={false}
          id='category'
          {...register('category', { required: 'Category is required' })}
          defaultValue=''
          className='flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400'
        >
          <option value='' disabled>
            Select category
          </option>
          {[...categories]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </select>
        {errors.category && (
          <p className='text-red-600 mt-1 md:mt-0 md:ml-4 text-sm'>
            {errors.category.message}
          </p>
        )}
      </div>

      <div className='md:flex md:items-start md:space-x-4'>
        <label className='md:w-40 font-semibold pt-2'>Attributes</label>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1'>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              disabled={false}
              {...register('isSponsored')}
            />
            <span>Sponsored</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              disabled={false}
              {...register('hasPromotions')}
            />
            <span>Has Promotions</span>
          </label>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              disabled={false}
              {...register('isTrusted')}
            />
            <span>Trusted</span>
          </label>
          <label className='flex items-center gap-2'>
            <input type='checkbox' disabled={false} {...register('isNew')} />
            <span>New Business</span>
          </label>
        </div>
      </div>

      {/* Owner Image */}
      <ImageUploaderWithPreview
        label='Owner Image'
        file={ownerImageFile}
        setFile={setOwnerImageFile}
        width={128}
        height={170}
      />

      {/* Logo */}
      <ImageUploaderWithPreview
        label='Logo'
        file={logoFile}
        setFile={setLogoFile}
        width={128}
        height={128}
      />

      {/* Business Card */}
      <ImageUploaderWithPreview
        label='Business Card'
        file={businessCardFile}
        setFile={setBusinessCardFile}
        width={256}
        height={144}
      />

      {/* Banner Image (new) */}
      <ImageUploaderWithPreview
        label='Banner Image'
        file={bannerImageFile}
        setFile={setBannerImageFile}
        width={800}
        height={200}
      />

      <Button type='submit' disabled={loading}>
        {loading
          ? 'Saving...'
          : mode === 'add'
          ? 'Add Business'
          : 'Update Business'}
      </Button>
    </form>
  );
}
