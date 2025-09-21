'use client';
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { GlassInput } from '@/app/client/businesses/_components/GlassInputs';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { BusinessContactConfig } from '@/types/business';
import { addOrUpdateContacts } from '../../clientReducer/clientBusinessReducer';

export default function ContactTab({ businessId }: { businessId: string }) {
  const business = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness
  );

  const [dirty, setDirty] = useState(false);

  const { register, handleSubmit, reset } = useForm<BusinessContactConfig>({
    defaultValues: {
      isEnabled: true,
      phone: '',
      email: '',
      address: '',
      website: '',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      },
    },
  });

  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<BusinessContactConfig> = (data) => {
    console.log('Saving contact data...', data);
    dispatch(addOrUpdateContacts(businessId, data));
  };

  // Helper to mark form dirty
  const registerWithDirty = (name: any) => ({
    ...register(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      register(name).onChange(e);
      setDirty(true);
    },
  });

  const handleFormSubmit: SubmitHandler<BusinessContactConfig> = (data) => {
    console.log('📩 Contact data:', data);
    onSubmit(data);
    setDirty(false);
  };

  // Reset form if business changes
  useEffect(() => {
    if (business?.businessConfig?.contactConfig) {
      reset(business.businessConfig.contactConfig);
      setDirty(false);
    }
  }, [business, reset]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='space-y-6 relative'
    >
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Business Contacts</h3>
        <p className='text-sm/6 text-muted-foreground'>
          Add phone, email, website, and social media for your business.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <GlassInput
            label='Phone'
            type='tel'
            placeholder='+1 (555) 123-4567'
            {...registerWithDirty('phone')}
          />
          <GlassInput
            label='Email'
            type='email'
            placeholder='contact@email.com'
            {...registerWithDirty('email')}
          />
          <GlassInput
            label='Address'
            type='text'
            placeholder='123 Main St, City'
            {...registerWithDirty('address')}
          />
          <GlassInput
            label='Website'
            type='url'
            placeholder='https://example.com'
            {...registerWithDirty('website')}
          />
        </div>

        <h4 className='text-lg font-medium mt-6'>Social Links</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <GlassInput
            label='Facebook'
            type='url'
            placeholder='https://facebook.com/yourpage'
            {...registerWithDirty('socialLinks.facebook')}
          />
          <GlassInput
            label='Instagram'
            type='url'
            placeholder='https://instagram.com/yourprofile'
            {...registerWithDirty('socialLinks.instagram')}
          />
          <GlassInput
            label='Twitter'
            type='url'
            placeholder='https://twitter.com/yourhandle'
            {...registerWithDirty('socialLinks.twitter')}
          />
          <GlassInput
            label='LinkedIn'
            type='url'
            placeholder='https://linkedin.com/in/yourprofile'
            {...registerWithDirty('socialLinks.linkedin')}
          />
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
              reset(business?.businessConfig?.contactConfig || {});
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
