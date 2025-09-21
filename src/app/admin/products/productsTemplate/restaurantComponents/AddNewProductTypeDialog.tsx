'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { serverTimestamp } from 'firebase/firestore';

type Props = {
  businessId: string;
  open: boolean;
  onClose: () => void;
  onAdded: (type: string) => void;
};

export default function AddNewProductTypeDialog({
  businessId,
  open,
  onClose,
  onAdded,
}: Props) {
  const [newType, setNewType] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear input when dialog is opened
  useEffect(() => {
    if (open) {
      setNewType('');
    }
  }, [open]);

  const handleAddType = async () => {
    const trimmedType = newType.trim();
    if (!trimmedType) {
      alert('Please enter a product type name.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'businesses', businessId, 'products', trimmedType);

      await setDoc(docRef, {});

      onAdded(trimmedType);
      onClose();
    } catch (err) {
      console.error('Failed to add product type:', err);
      alert('Failed to add product type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
          />
        </div>
        <div className='mt-4 flex justify-end gap-2'>
          <Button onClick={onClose} variant='ghost' disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddType} disabled={loading}>
            {loading ? 'Adding...' : 'Add Type'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
