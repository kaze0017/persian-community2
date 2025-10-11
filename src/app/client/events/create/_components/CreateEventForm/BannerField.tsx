import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { CreateEventFormValues } from './types';

type Props = {
  setBannerFile: (file?: File) => void;
  bannerFile?: File;
};

export default function BannerField({ bannerFile, setBannerFile }: Props) {
  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>Event Banner</label>
      <Input
        type='file'
        accept='image/*'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setBannerFile(file);
        }}
      />
      {bannerFile && (
        <Image
          src={URL.createObjectURL(bannerFile)}
          alt='Banner Preview'
          className='mt-2 max-h-48 object-cover rounded-lg'
          width={300}
          height={150}
        />
      )}
    </div>
  );
}
