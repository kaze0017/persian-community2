'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Person } from '@/types/person';
import Image from 'next/image';

interface PersonFormProps {
  initialData?: Partial<Person>;
  onSave: (data: Partial<Person> & { file?: File }) => void;
  onCancel: () => void;
}

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function PersonForm({ initialData, onSave, onCancel }: PersonFormProps) {
  const { register, handleSubmit } = useForm<Partial<Person>>({
    defaultValues: initialData || {},
  });

  const [file, setFile] = useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialData?.photoUrl
  );

  useEffect(() => {
    if (!file) {
      setPreviewUrl(initialData?.photoUrl);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file, initialData?.photoUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      alert('Only JPG, PNG, or WEBP images are allowed.');
      e.target.value = '';
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Maximum image size is ${MAX_FILE_SIZE_MB} MB.`);
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
  };

  const onSubmit = (data: Partial<Person>) => {
    onSave({ ...data, file });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 max-w-md'>
      <div>
        <Label>Name</Label>
        <Input {...register('name', { required: true })} required />
      </div>

      <div>
        <Label>Bio</Label>
        <Textarea {...register('bio')} />
      </div>

      <div>
        <Label>Profile Photo</Label>
        <Input type='file' accept='image/*' onChange={onFileChange} />
        {previewUrl && (
          <Image
            width={128}
            height={128}
            className='mt-2 w-32 h-32 object-cover rounded-md border'
            src={previewUrl}
            alt='Preview'
          />
        )}
      </div>

      <div>
        <Label>LinkedIn URL</Label>
        <Input {...register('linkedInUrl')} type='url' />
      </div>

      <div>
        <Label>Email (for connection request)</Label>
        <Input {...register('email')} type='email' />
      </div>

      <div className='flex gap-4 mt-4'>
        <Button type='submit'>Save</Button>
        <Button variant='outline' type='button' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
