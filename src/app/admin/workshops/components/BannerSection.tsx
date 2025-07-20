'use client';

import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button'; // Shadcn button or your own

export default function BannerSection({
  onFileSelected,
}: {
  onFileSelected: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelected(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className='space-y-4'>
      <input
        ref={fileInputRef}
        id='bannerFile'
        type='file'
        accept='image/*'
        onChange={handleChange}
        className='hidden'
      />
      <Button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        variant='outline'
      >
        {previewUrl ? 'Change Banner' : 'Upload Banner'}
      </Button>

      {previewUrl && (
        <Image
          src={previewUrl}
          alt='Banner preview'
          width={500}
          height={200}
          className='mt-2 max-h-48 object-contain'
          style={{ maxWidth: '100%' }}
        />
      )}
    </div>
  );
}
