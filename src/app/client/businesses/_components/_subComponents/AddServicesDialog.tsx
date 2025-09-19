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
import {
  addBusinessService,
  updateBusinessService,
  deleteBusinessService,
} from '@/app/client/clientReducer/clientBusinessReducer';
import { BusinessService } from '@/types/business';

type Props = {
  businessId: string;
  open: boolean;
  onClose: () => void;
  service?: BusinessService | null; // if null → add mode, otherwise edit mode
};

export default function ServiceDialog({
  businessId,
  open,
  onClose,
  service,
}: Props) {
  const dispatch = useAppDispatch();

  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [files, setFiles] = useState<{ icon?: File }>({});
  const [changed, setChanged] = useState<{ icon: boolean }>({ icon: false });
  const [loading, setLoading] = useState(false);

  // Prefill fields if editing
  useEffect(() => {
    if (service) {
      setServiceName(service.name || '');
      setServiceDescription(service.description || '');
    } else {
      resetForm();
    }
  }, [service, open]);

  const resetForm = () => {
    setServiceName('');
    setServiceDescription('');
    setFiles({});
    setChanged({ icon: false });
  };

  const handleSave = async () => {
    if (!serviceName.trim() || !serviceDescription.trim()) return;

    setLoading(true);
    try {
      if (service) {
        // EDIT
        await updateBusinessService(businessId, service.id, {
          name: serviceName,
          description: serviceDescription,
          file: files.icon,
        })(dispatch);
      } else {
        // ADD
        await addBusinessService(businessId, {
          name: serviceName,
          description: serviceDescription,
          file: files.icon,
        })(dispatch);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    setLoading(true);
    try {
      await deleteBusinessService(businessId, service.id)(dispatch);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-2xl bg-white/20 backdrop-blur-md border border-white/30'>
        <DialogHeader>
          <DialogTitle>
            {service ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
        </DialogHeader>

        <div className='mt-2 flex flex-col gap-4'>
          <GlassInput
            label='Service Name'
            type='text'
            placeholder='Enter service name'
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          <GlassInput
            label='Service Description'
            type='text'
            placeholder='Enter service description'
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          />
          <GlassImageUpload
            label='Service Image'
            defaultImage={
              service?.iconUrl || '/images/placeholders/service1.webp'
            }
            wide={false}
            imgStyle={filter}
            onChange={(e) => {
              const file = e.target.files?.[0] || undefined;
              setFiles((prev) => ({ ...prev, icon: file }));
              setChanged((prev) => ({ ...prev, icon: true }));
            }}
          />
        </div>

        <div className='mt-4 flex justify-between'>
          <Button onClick={onClose} variant='ghost' className='min-w-[100px]'>
            Cancel
          </Button>

          <div className='flex gap-2'>
            {service && (
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
                ? service
                  ? 'Saving...'
                  : 'Adding...'
                : service
                  ? 'Save Changes'
                  : 'Add Service'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
