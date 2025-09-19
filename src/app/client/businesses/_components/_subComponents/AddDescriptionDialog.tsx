'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GlassInput } from '../GlassInputs';
import { GlassTextarea } from '../GlassInputs';
import { Textarea } from '@/components/ui/textarea';

type DescriptionDialogProps = {
  open: boolean;
  onClose: () => void;
  value?: string | null; // if null → add mode, otherwise edit mode
  onSave: (description: string) => void;
  onDelete?: () => void; // optional delete callback
};

export default function DescriptionDialog({
  open,
  onClose,
  value = null,
  onSave,
  onDelete,
}: DescriptionDialogProps) {
  const [description, setDescription] = useState(value || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDescription(value || '');
  }, [value, open]);

  const handleSave = () => {
    if (!description.trim()) return;
    setLoading(true);
    try {
      onSave(description);
      setDescription('');
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
      setDescription('');
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
            {isEditMode ? 'Edit Description' : 'Add Description'}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          <GlassTextarea
            label='Description'
            placeholder='Enter description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
                  : 'Add Description'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
