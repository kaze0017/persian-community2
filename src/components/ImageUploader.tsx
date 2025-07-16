'use client';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import Image from 'next/image';

export default function ImageUploader() {
  const [imageURL, setImageURL] = useState('');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const path = 'profile_pictures/';
    const fileName = `${Date.now()}-${file.name}`;
    const fullPath = `${path}${fileName}`;
    const imageRef = ref(storage, fullPath);

    try {
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setImageURL(downloadURL);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className='space-y-4'>
      <input type='file' onChange={handleFileChange} />
      {imageURL && (
        <div>
          <p>Image uploaded:</p>
          <Image
            src={imageURL}
            alt='Uploaded'
            width={200}
            height={200}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}
