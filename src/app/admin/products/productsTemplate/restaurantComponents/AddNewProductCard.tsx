'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';
import { uploadImage } from '@/services/storageService';
import { createDocument } from '../../services';
import { v4 as uuidv4 } from 'uuid';
import { RestaurantProduct } from '@/types/RestaurantProduct';
import { Timestamp } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

type ProductType = 'drink' | 'meal' | 'snack' | 'dessert';

type Props = {
  type: ProductType;
  businessId: string;
  onAdd?: (product: RestaurantProduct) => void;
};

const categoryOptions: Record<ProductType, string[]> = {
  drink: ['softDrink', 'juice', 'alcoholic'],
  meal: ['breakfast', 'lunch', 'dinner', 'mainCourse'],
  snack: ['chips', 'nuts', 'candy'],
  dessert: ['cake', 'iceCream', 'pastry'],
};

export default function AddNewProductCard({ type, businessId, onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    isAvailable: true,
    featured: false,
    category: '',
  });

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Please enter a product name.');
      return;
    }

    if (!form.category) {
      alert('Please select a category.');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = form.imageUrl;

      if (selectedImage) {
        const path = `businesses/${businessId}/products/${type}/${Date.now()}_${
          selectedImage.name
        }`;
        imageUrl = await uploadImage(selectedImage, path);
      }

      const priceNum = form.price ? parseFloat(form.price) : undefined;

      const productData: RestaurantProduct = {
        id: uuidv4(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: priceNum,
        imageUrl,
        isAvailable: form.isAvailable,
        featured: form.featured,
        type,
        category: form.category,
      };

      const productPath = `businesses/${businessId}/products/${type}/items`;

      await createDocument<typeof productData>(productPath, productData);

      if (onAdd) onAdd(productData);

      setForm({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        isAvailable: true,
        featured: false,
        category: '',
      });

      setSelectedImage(null);
      setOpen(false);
    } catch (err) {
      console.error('Failed to add product:', err);
      alert('Failed to add product. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className='flex cursor-pointer items-center justify-center border-dashed border-2 border-muted-foreground hover:bg-muted transition-all'>
          <CardContent className='flex flex-col items-center justify-center p-6 text-muted-foreground'>
            <Plus className='w-6 h-6 mb-2' />
            <span className='capitalize'>Add new {type}</span>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Add new {type}</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div>
            <Label>Name</Label>
            <Input
              placeholder='Product name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              placeholder='Description'
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type='number'
              placeholder='Price'
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>

          <div>
            <Label>Image</Label>
            <Input
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
                className='mt-2 rounded'
                width={100}
                height={100}
              />
            )}
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(val) => setForm({ ...form, category: val })}
            >
              <SelectTrigger className='w-full bg-background'>
                <SelectValue placeholder='Select category' />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions[type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center justify-between'>
            <Label>Available?</Label>
            <Switch
              checked={form.isAvailable}
              onCheckedChange={(val) => setForm({ ...form, isAvailable: val })}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label>Featured?</Label>
            <Switch
              checked={form.featured}
              onCheckedChange={(val) => setForm({ ...form, featured: val })}
            />
          </div>
        </div>

        <div className='flex justify-end'>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? (
              <span className='flex items-center gap-2'>
                <Loader2 className='w-4 h-4 animate-spin' />
                Uploading...
              </span>
            ) : (
              'Add Product'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
