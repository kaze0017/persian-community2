'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

import { addProductWithImage } from './helpers';
import { RestaurantProduct } from '@/types/RestaurantProduct';

type Props = {
  businessId: string;
  type: string;
  open: boolean;
  onClose: () => void;
  onAdded: (newItem: {
    id: string;
    name: string;
    description: string;
    price: number;
    options: string;
    featured: boolean;
    available: boolean;
    imageUrl: string;
    createdAt: string;
  }) => void;
};

export default function AddNewProductDialog({
  businessId,
  type,
  open,
  onClose,
  onAdded,
}: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    options: '',
    featured: false,
    available: true,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddProduct = async () => {
    if (!form.name.trim()) {
      alert('Please enter product name');
      return;
    }

    setUploading(true);

    try {
      // Call your helper function, passing required params
      const newItem: RestaurantProduct = await addProductWithImage(
        businessId,
        type,
        form,
        selectedImage
      );

      // Reset form and image
      setForm({
        name: '',
        description: '',
        price: '',
        options: '',
        featured: false,
        available: true,
      });
      setSelectedImage(null);

      // Callback to parent or state update
      onAdded(newItem);

      // Close modal or panel
      onClose();
    } catch (err) {
      console.error('Failed to add product', err);
      alert('Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product to "{type}"</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <Input
            placeholder='Name'
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          <Input
            placeholder='Description'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder='Price'
            type='number'
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            placeholder='Options (comma separated)'
            value={form.options}
            onChange={(e) => setForm({ ...form, options: e.target.value })}
          />

          <div>
            <label className='flex items-center gap-2'>
              <Switch
                checked={form.featured}
                onCheckedChange={(val) => setForm({ ...form, featured: val })}
              />
              Featured
            </label>
          </div>

          <div>
            <label className='flex items-center gap-2'>
              <Switch
                checked={form.available}
                onCheckedChange={(val) => setForm({ ...form, available: val })}
              />
              Available
            </label>
          </div>

          <div>
            <label>Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedImage(file);
              }}
            />
            {selectedImage && (
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt='Preview'
                width={100}
                height={100}
                className='mt-2 rounded'
              />
            )}
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Button onClick={onClose} variant='ghost' disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleAddProduct} disabled={uploading}>
            {uploading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
