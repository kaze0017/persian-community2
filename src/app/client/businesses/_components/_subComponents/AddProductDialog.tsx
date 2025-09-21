'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GlassImageUpload, GlassInput } from '../GlassInputs';
import { filter } from '@/app/components/filters/logoFilter';
import { useAppDispatch } from '@/app/hooks';
// import {
//   addRestaurantProduct,
//   updateRestaurantProduct,
//   deleteRestaurantProduct,
// } from '@/app/client/clientReducer/clientProductReducer'; // You need to create this reducer
import { RestaurantProduct } from '@/types/RestaurantProduct';
import {
  addOrUpdateProduct,
  deleteBusinessProduct as deleteProduct,
} from '@/app/client/clientReducer/clientBusinessReducer';
type Props = {
  businessId: string;
  type: string; // category/type of product: Appetizer, Meal, Dessert, Drink
  open: boolean;
  onClose: () => void;
  product?: RestaurantProduct | null; // if null → add mode, otherwise edit mode
};

export default function ProductDialog({
  businessId,
  type,
  open,
  onClose,
  product,
}: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [files, setFiles] = useState<{ image?: File }>({});
  const [changed, setChanged] = useState<{ image: boolean }>({ image: false });
  const [loading, setLoading] = useState(false);

  // Prefill fields if editing
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price);
    } else {
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice(undefined);
    setFiles({});
    setChanged({ image: false });
  };

  const handleSave = async () => {
    if (!name.trim() || price === undefined) return;

    setLoading(true);
    try {
      if (product) {
        // EDIT
        await addOrUpdateProduct(
          businessId,
          {
            id: product?.id, // undefined if adding
            name,
            description,
            price,
          },
          type,
          files.image
        )(dispatch);
      } else {
        // ADD
        await addOrUpdateProduct(
          businessId,
          {
            name,
            description,
            price,
          },
          type,
          files.image
        )(dispatch);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await deleteProduct(businessId, type, product.id || '')(dispatch);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-2xl bg-white/20 backdrop-blur-md border border-white/30'>
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          <GlassInput
            label='Product Name'
            type='text'
            placeholder='Enter product name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <GlassInput
            label='Product Description'
            type='text'
            placeholder='Enter product description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <GlassInput
            label='Price'
            type='number'
            placeholder='Enter price'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <GlassImageUpload
            label='Product Image'
            defaultImage={
              product?.imageUrl || '/images/placeholders/product.webp'
            }
            wide={false}
            imgStyle={''}
            onChange={(e) => {
              const file = e.target.files?.[0] || undefined;
              setFiles((prev) => ({ ...prev, image: file }));
              setChanged((prev) => ({ ...prev, image: true }));
            }}
          />
        </div>

        <div className='mt-4 flex justify-between'>
          <Button onClick={onClose} variant='ghost' className='min-w-[100px]'>
            Cancel
          </Button>

          <div className='flex gap-2'>
            {product && (
              <Button
                onClick={handleDelete}
                variant='destructive'
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            <Button onClick={handleSave} disabled={loading}>
              {loading
                ? product
                  ? 'Saving...'
                  : 'Adding...'
                : product
                  ? 'Save Changes'
                  : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
