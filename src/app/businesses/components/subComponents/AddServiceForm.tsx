'use client';

import { useRef, useState } from 'react';
import { BusinessService } from '@/types/business';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { uploadImage } from '@/services/storageService';

interface Props {
  onSave: (service: BusinessService) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AddServiceForm({ onSave, onCancel, loading }: Props) {
  const [form, setForm] = useState<Partial<BusinessService>>({
    name: '',
    description: '',
    price: undefined,
    duration: undefined,
    isAvailable: true,
    iconUrl: '',
    imageUrl: '',
  });

  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: keyof BusinessService,
    value: string | number | boolean | null | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'iconUrl' | 'imageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, `services/${crypto.randomUUID()}`);
      handleChange(field, url);
    } catch (err) {
      console.error(`Error uploading ${field}:`, err);
    }
  };

  const handleSubmit = () => {
    if (!form.name) return;
    const cleanedForm = Object.fromEntries(
      Object.entries(form).filter(([, /* _ */ v]) => v !== undefined)
    );

    onSave({
      ...cleanedForm,
      id: crypto.randomUUID(),
      createdAt: null,
    } as BusinessService);
  };

  return (
    <div className='p-4 border rounded-md bg-muted/20 space-y-4'>
      <Input
        placeholder='Service Name'
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        disabled={loading}
      />
      <Textarea
        placeholder='Description'
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        disabled={loading}
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <Input
          type='number'
          placeholder='Price'
          value={form.price ?? ''}
          onChange={(e) => handleChange('price', parseFloat(e.target.value))}
          disabled={loading}
        />
        <Input
          type='number'
          placeholder='Duration (min)'
          value={form.duration ?? ''}
          onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
          disabled={loading}
        />
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-sm'>Available</span>
        <Switch
          checked={form.isAvailable}
          onCheckedChange={(val) => handleChange('isAvailable', val)}
          disabled={loading}
        />
      </div>

      {/* Upload icon */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
        <div className='flex flex-col gap-1'>
          <span className='text-sm'>Icon</span>
          <input
            ref={iconInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => handleUpload(e, 'iconUrl')}
            disabled={loading}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => iconInputRef.current?.click()}
            disabled={loading}
          >
            Upload Icon
          </Button>
          {form.iconUrl && (
            <Image
              src={form.iconUrl}
              alt='Icon Preview'
              width={48}
              height={48}
              className='mt-1 border rounded'
            />
          )}
        </div>

        {/* Upload image */}
        <div className='flex flex-col gap-1'>
          <span className='text-sm'>Image</span>
          <input
            ref={imageInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => handleUpload(e, 'imageUrl')}
            disabled={loading}
          />
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => imageInputRef.current?.click()}
            disabled={loading}
          >
            Upload Image
          </Button>
          {form.imageUrl && (
            <Image
              src={form.imageUrl}
              alt='Image Preview'
              width={96}
              height={96}
              className='mt-1 border rounded'
            />
          )}
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading || !form.name}>
          Save
        </Button>
      </div>
    </div>
  );
}
