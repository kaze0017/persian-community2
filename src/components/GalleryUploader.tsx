'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { uploadImage } from '@/services/storageService';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

interface GalleryImageForm {
  file: File;
  url?: string;
  title?: string;
  caption?: string;
  photographer?: string;
  date?: string;
  previewUrl?: string; // for local preview
}

export default function GalleryUploader({
  businessId,
  onComplete,
}: {
  businessId: string;
  onComplete?: () => void;
}) {
  const [images, setImages] = useState<GalleryImageForm[]>([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit } = useForm<{
    galleryTitle: string;
    description?: string;
  }>();

  const onDrop = (acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Clean up preview URLs on unmount or when images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, [images]);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async (formData: {
    galleryTitle: string;
    description?: string;
  }) => {
    if (!formData.galleryTitle.trim()) {
      alert('Gallery title is required.');
      return;
    }
    if (images.length === 0) {
      alert('Please add some images before uploading.');
      return;
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        images.map(async (img) => {
          const imageId = uuidv4();
          const path = `galleries/${businessId}/${imageId}`;
          const url = await uploadImage(img.file, path);
          return {
            url,
            title: img.title || '',
            caption: img.caption || '',
            photographer: img.photographer || '',
            date: img.date || '',
          };
        })
      );

      const galleryDocRef = doc(
        db,
        'businesses',
        businessId,
        'gallery',
        businessId
      );
      await setDoc(galleryDocRef, {
        title: formData.galleryTitle,
        description: formData.description || '',
        images: uploaded,
        // createdAt: new Date(),
      });

      if (onComplete) onComplete();
      alert('Gallery uploaded successfully!');
      setImages([]); // clear after upload
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleUpload)}
      className='space-y-6 max-w-2xl mx-auto'
    >
      <Input
        {...register('galleryTitle', { required: true })}
        placeholder='Gallery Title *'
      />
      <Textarea
        {...register('description')}
        placeholder='Gallery Description (optional)'
      />

      <div
        {...getRootProps()}
        className='border border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50'
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop images here...</p>
        ) : (
          <p>Drag & drop or click to select images</p>
        )}
      </div>

      {images.length > 0 && (
        <div className='space-y-4'>
          {images.map((img, idx) => (
            <div key={idx} className='p-4 border rounded-xl space-y-2 relative'>
              {img.previewUrl && (
                <Image
                  src={img.previewUrl}
                  alt={`Preview ${idx + 1}`}
                  width={200}
                  height={200}
                  className='rounded object-cover'
                />
              )}
              <button
                type='button'
                onClick={() => removeImage(idx)}
                className='absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700'
                aria-label='Remove image'
              >
                ×
              </button>
              <Input
                placeholder='Title'
                value={img.title || ''}
                onChange={(e) => {
                  const copy = [...images];
                  copy[idx].title = e.target.value;
                  setImages(copy);
                }}
              />
              <Input
                placeholder='Photographer'
                value={img.photographer || ''}
                onChange={(e) => {
                  const copy = [...images];
                  copy[idx].photographer = e.target.value;
                  setImages(copy);
                }}
              />
              <Input
                type='date'
                placeholder='Date'
                value={img.date || ''}
                onChange={(e) => {
                  const copy = [...images];
                  copy[idx].date = e.target.value;
                  setImages(copy);
                }}
              />
              <Textarea
                placeholder='Caption'
                value={img.caption || ''}
                onChange={(e) => {
                  const copy = [...images];
                  copy[idx].caption = e.target.value;
                  setImages(copy);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Button type='submit' disabled={uploading} className='w-full'>
        {uploading ? 'Uploading...' : 'Upload Gallery'}
      </Button>
    </form>
  );
}
