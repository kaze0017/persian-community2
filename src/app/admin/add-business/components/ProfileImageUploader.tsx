'use client';

import React from 'react';
import Image from 'next/image';
import { Pencil, Plus } from 'lucide-react';

type Props = {
  label: string;
  previewUrl: string | null;
  onUpload: (file: File) => Promise<void>;
  width?: number;
  height?: number;
};

export default function ProfileImageUploader({
  label,
  previewUrl,
  onUpload,
  width = 128,
  height = 128,
}: Props) {
  const inputId = label.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className='space-y-2'>
      <label htmlFor={inputId} className='md:w-40 font-semibold block'>
        {label}
      </label>
      <div
        className='relative rounded-md overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group cursor-pointer hover:border-blue-500 transition-all'
        style={{ width, height }}
      >
        <label htmlFor={inputId} className='block relative w-full h-full'>
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt={`${label} Preview`}
                width={width}
                height={height}
                className='object-cover w-full h-full'
              />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                <Pencil className='text-white w-6 h-6' />
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center w-full h-full'>
              <Plus className='w-10 h-10 text-gray-400 group-hover:text-blue-500' />
            </div>
          )}
        </label>
        <input
          id={inputId}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await onUpload(file);
          }}
        />
      </div>
    </div>
  );
}
