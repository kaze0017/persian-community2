'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GlassTextarea, GlassInput } from '../GlassInputs';

type DescriptionDialogProps = {
  open: boolean;
  onClose: () => void;
  value?: string | null; // if null → add mode, otherwise edit mode
  onSave: (googlePlaceId: string) => void;
  onDelete?: () => void; // optional delete callback
};

export default function AddGoogleIdDialog({
  open,
  onClose,
  value = null,
  onSave,
  onDelete,
}: DescriptionDialogProps) {
  const [googlePlaceId, setGooglePlaceId] = useState(value || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGooglePlaceId(value || '');
  }, [value, open]);

  const handleSave = () => {
    if (!googlePlaceId.trim()) return;
    setLoading(true);
    try {
      onSave(googlePlaceId);
      setGooglePlaceId('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      onDelete();
      setGooglePlaceId('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = Boolean(value);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-2xl bg-white/20 backdrop-blur-md border border-white/30'>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Google Place ID' : 'Add Google Place ID'}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          <GlassInput
            label='Google Place ID'
            type='text'
            placeholder='Enter Google Place ID'
            value={googlePlaceId}
            onChange={(e) => setGooglePlaceId(e.target.value)}
          />
        </div>

        <div className='mt-4 flex justify-between'>
          <Button onClick={onClose} variant='ghost' className='min-w-[100px]'>
            Cancel
          </Button>

          <div className='flex gap-2'>
            {isEditMode && onDelete && (
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
                ? isEditMode
                  ? 'Saving...'
                  : 'Adding...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Add Google Place ID'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
