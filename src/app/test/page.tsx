'use client';

import React, { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ImageUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async () => {
    if (!file) return;
    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    setUploadUrl(downloadURL);
    alert('Upload successful!');
  };

  return (
    <div className='p-4 border rounded space-y-4'>
      <input type='file' accept='image/*' onChange={handleFileChange} />
      {preview && (
        <img src={preview} alt='Preview' className='max-w-xs rounded' />
      )}
      <button
        onClick={handleUpload}
        className='px-4 py-2 bg-blue-600 text-white rounded'
      >
        Upload Image
      </button>
      {uploadUrl && (
        <p className='text-green-600'>
          Uploaded:{' '}
          <a href={uploadUrl} target='_blank'>
            {uploadUrl}
          </a>
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
