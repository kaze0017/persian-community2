'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

import type { RestaurantProduct } from '@/types/RestaurantProduct';

import { Badge } from '@/components/ui/badge';
import { updateProductItem } from '@/app/admin/products/productsTemplate/restaurantComponents/helpers';

type Props = {
  item: RestaurantProduct;
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  businessId?: string;
  type?: string;
  onUpdate?: (updatedItem: RestaurantProduct) => void;
};

export default function ProductDetailsDialog({
  item,
  open,
  onClose,
  isAdmin = false,
  businessId,
  type,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<RestaurantProduct>(item);

  useEffect(() => {
    setForm(item);
    setIsEditing(false);
  }, [item, open]);

  const handleSave = async () => {
    if (!businessId || !type) {
      alert('Missing business or product type');
      return;
    }

    if (!form.id) {
      alert('Missing product ID');
      return;
    }

    try {
      await updateProductItem(businessId, type, form.id, form);

      onUpdate?.(form);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product.');
    }
  };

  const handleCancel = () => {
    setForm(item);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{form.name}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='w-full h-64 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-700'>
            {form.imageUrl ? (
              <Image
                src={form.imageUrl}
                alt={form.name}
                fill
                className='object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                No Image
              </div>
            )}
          </div>

          <div className='space-y-2'>
            {isAdmin && isEditing ? (
              <>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder='Name'
                  className='mb-2'
                />
                <Input
                  value={form.description || ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder='Description'
                  className='mb-2'
                />
                <Input
                  type='number'
                  value={form.price ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder='Price'
                  className='mb-2'
                />
                <div className='flex flex-wrap gap-2 mt-2 items-center'>
                  <Switch
                    checked={form.isFeatured || false}
                    onCheckedChange={(val) =>
                      setForm((f) => ({ ...f, isFeatured: val }))
                    }
                    id='featured-switch'
                  />
                  <label htmlFor='featured-switch' className='select-none'>
                    Featured
                  </label>
                  <Switch
                    checked={form.isAvailable ?? true}
                    onCheckedChange={(val) =>
                      setForm((f) => ({ ...f, isAvailable: val }))
                    }
                    id='available-switch'
                  />
                  <label htmlFor='available-switch' className='select-none'>
                    Available
                  </label>
                </div>
                <Input
                  value={form.options || ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, options: e.target.value }))
                  }
                  placeholder='Options (JSON string)'
                  className='mt-2'
                />
              </>
            ) : (
              <>
                {form.description && (
                  <p className='text-sm text-muted-foreground'>
                    {form.description}
                  </p>
                )}
                {typeof form.price === 'number' && (
                  <p className='font-semibold text-lg'>
                    ${form.price.toFixed(2)}
                  </p>
                )}

                <div className='flex flex-wrap gap-2 mt-2'>
                  {form.isFeatured && (
                    <Badge variant='outline'>🌟 Featured</Badge>
                  )}
                  {form.isAvailable === false && (
                    <Badge variant='destructive'>Unavailable</Badge>
                  )}
                  {'category' in form && form.category && (
                    <Badge variant='secondary'>{form.category}</Badge>
                  )}
                  {form.options && (
                    <div className='flex flex-wrap gap-2'>
                      {(() => {
                        try {
                          const parsedOptions = JSON.parse(form.options);
                          if (Array.isArray(parsedOptions)) {
                            return parsedOptions.map(
                              (opt: string, i: number) => (
                                <Badge key={i} variant='outline'>
                                  {opt}
                                </Badge>
                              )
                            );
                          }
                          return null;
                        } catch {
                          return null;
                        }
                      })()}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {isAdmin && (
          <DialogFooter className='flex gap-2'>
            {!isEditing ? (
              <Button variant='default' onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant='secondary' onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant='default' onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
