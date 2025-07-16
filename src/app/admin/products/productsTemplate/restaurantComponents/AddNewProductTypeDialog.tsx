'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createDocument } from '@/services/firestoreService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  businessId: string;
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
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
      // Create a document reference (must be even number of path segments)
      // Path: businesses/{businessId}/products/{trimmedType}
      const docRef = doc(db, 'businesses', businessId, 'products', trimmedType);

      // Set the document data
      await setDoc(docRef, { createdAt: Date.now() });

      onAdded();
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
