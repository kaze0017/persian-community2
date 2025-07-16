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
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { createDocument } from '@/services/firestoreService';

type Props = {
  onAddType: (newType: string) => void;
};

export default function AddNewProductType({ onAddType }: Props) {
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddType = async () => {
    const trimmedType = newType.trim();
    if (!trimmedType) {
      alert('Please enter a product type name.');
      return;
    }

    setLoading(true);
    try {
      const docPath = `businesses/AtvzoHHD9hhRPLM9zIKw/products/${trimmedType}`;
      await createDocument(docPath, { createdAt: Date.now() });

      onAddType(trimmedType);
      setNewType('');
      setOpen(false);
    } catch (err) {
      console.error('Failed to add product type:', err);
      alert('Failed to add product type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(openState) => {
        // Prevent closing dialog while loading
        if (!loading) setOpen(openState);
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add New Type
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product Type</DialogTitle>
        </DialogHeader>

        <div className='mt-2'>
          <Input
            placeholder='Enter new product type'
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            autoFocus
            disabled={loading}
          />
        </div>

        <div className='mt-4 flex justify-end gap-2'>
          <Button
            onClick={() => setOpen(false)}
            variant='ghost'
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddType} disabled={loading || !newType.trim()}>
            {loading ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
                Adding...
              </>
            ) : (
              'Add Type'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
