'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type UploadType = 'events' | 'businesses' | 'workshops';

export default function UploadEventsPage() {
  const [loading, setLoading] = useState<UploadType | null>(null);
  const [result, setResult] = useState<{
    uploaded: number;
    events: any[];
  } | null>(null);

  const handleUpload = async (type: UploadType) => {
    setLoading(type);
    setResult(null);
    try {
      const res = await fetch(`/api/uploads/upload-${type}`, {
        method: 'POST',
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert(`Error uploading ${type}`);
    } finally {
      setLoading(null);
    }
  };

  const getButtonLabel = (type: UploadType) => {
    if (loading === type)
      return `Uploading ${type.charAt(0).toUpperCase() + type.slice(1)}...`;
    return `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`;
  };

  return (
    <div className='p-8 flex flex-col items-start gap-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload to Pinecone</h1>

      <div className='flex gap-3'>
        {(['events', 'businesses', 'workshops'] as UploadType[]).map((type) => (
          <Button
            key={type}
            onClick={() => handleUpload(type)}
            disabled={!!loading}
            variant='default'
            className='bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition'
          >
            {getButtonLabel(type)}
          </Button>
        ))}
      </div>

      {result && (
        <div className='mt-6 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white w-full'>
          <p className='font-medium'>Total items uploaded: {result.uploaded}</p>
        </div>
      )}
    </div>
  );
}
