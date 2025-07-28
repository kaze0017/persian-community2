'use client';

import { useState, useRef } from 'react';
import { BusinessReward } from '@/types/business';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { uploadImage } from '@/services/storageService'; // Your upload helper
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  onSave: (reward: BusinessReward) => void;
  onCancel: () => void;
  loading?: boolean;
  businessId: string;
}

export default function AddRewardForm({
  onSave,
  onCancel,
  loading,
  businessId,
}: Props) {
  const [form, setForm] = useState<Partial<BusinessReward>>({
    name: '',
    description: '',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: keyof BusinessReward,
    value: string | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload the file to your storage and get URL
      const baseName = `${uuidv4()}`;
      const fileName = `${baseName}.jpg`;
      const path = `businesses/${businessId}/rewards/`;

      const url = (await uploadImage(file, path, fileName)).replace(
        fileName,
        `${baseName}_thumb.webp`
      );
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name) return;
    onSave({
      ...form,
      id: crypto.randomUUID(),
    } as BusinessReward);
  };

  return (
    <div className='p-4 border rounded-md bg-muted/20 space-y-4'>
      <Input
        placeholder='Reward Name'
        value={form.name}
        onChange={(e) => handleChange('name', e.target.value)}
        disabled={loading || uploading}
      />
      <Textarea
        placeholder='Description'
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        disabled={loading || uploading}
      />

      {/* Image upload */}
      <div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
          disabled={loading || uploading}
        />
        <Button
          variant='outline'
          size='sm'
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={loading || uploading}
        >
          {uploading
            ? 'Uploading...'
            : form.imageUrl
              ? 'Change Image'
              : 'Upload Image'}
        </Button>
        {form.imageUrl && (
          <Image src={form.imageUrl} alt='Reward' width={100} height={100} />
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          variant='ghost'
          onClick={onCancel}
          disabled={loading || uploading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || uploading || !form.name}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
