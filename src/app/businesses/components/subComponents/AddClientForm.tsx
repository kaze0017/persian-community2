'use client';

import { useRef, useState } from 'react';
import { BusinessClient } from '@/types/business';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { uploadImage } from '@/services/storageService';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  onSave: (client: BusinessClient) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AddClientForm({ onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState<Partial<BusinessClient>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    logoUrl: '',
  });

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: keyof BusinessClient,
    value: string | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, `clients/${crypto.randomUUID()}`);
      handleChange('logoUrl', url);
    } catch (err) {
      console.error('Error uploading logo:', err);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;

    onSave({
      ...form,
      id: crypto.randomUUID(),
      // createdAt: null,
    } as BusinessClient);
  };

  return (
    <div className='p-4 border rounded-md bg-muted/20 space-y-4'>
      <Input
        placeholder='Business Name'
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        disabled={loading}
      />
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          placeholder='Email'
          type='email'
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder='Phone'
          type='tel'
          value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={loading}
        />
      </div>
      <Textarea
        placeholder='Address'
        value={form.address}
        onChange={(e) => handleChange('address', e.target.value)}
        disabled={loading}
      />

      <div className='flex flex-col gap-2'>
        <span className='text-sm font-medium'>Logo</span>
        <input
          ref={logoInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleUpload}
          disabled={loading}
        />
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => logoInputRef.current?.click()}
          disabled={loading}
        >
          Upload Logo
        </Button>
        {form.logoUrl && (
          <Image
            src={form.logoUrl}
            alt='Client Logo'
            width={80}
            height={80}
            className='mt-1 border rounded object-contain bg-white p-1'
          />
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.phone}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
