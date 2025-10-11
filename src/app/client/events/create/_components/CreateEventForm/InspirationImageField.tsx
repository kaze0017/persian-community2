import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { CreateEventFormValues } from './types';

type Props = {
  inspirationImage?: File;
  setInspirationImage: (file?: File) => void;
  imageText: string;
  setImageText: (text: string) => void;
};

export default function InspirationImageField({
  inspirationImage,
  setInspirationImage,
  imageText,
  setImageText,
}: Props) {
  useEffect(() => {
    const processImage = async () => {
      if (!inspirationImage) {
        setImageText('');
        return;
      }
      const formData = new FormData();
      formData.append('image', inspirationImage);
      const res = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) return setImageText('');
      const { text } = await res.json();
      setImageText(text || '');
    };
    processImage();
  }, [inspirationImage, setImageText]);

  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>
        Inspiration Image (Optional)
      </label>
      <Input
        type='file'
        accept='image/*'
        onChange={(e) => setInspirationImage(e.target.files?.[0])}
      />
      {inspirationImage && (
        <Image
          src={URL.createObjectURL(inspirationImage)}
          alt='Inspiration Image Preview'
          className='mt-2 max-h-48 object-cover rounded-lg'
          width={300}
          height={150}
        />
      )}
      {imageText && (
        <div className='mt-2'>
          <label className='block font-medium mb-1'>Extracted Image Text</label>
          <Textarea value={imageText} readOnly rows={3} />
        </div>
      )}
    </div>
  );
}
