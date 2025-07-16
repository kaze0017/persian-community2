'use client';

import { useState, useEffect } from 'react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import MapDisplay from '@/app/admin/MapDisplay';
import MapSelector from '@/app/admin/MapSelector'; // Assuming you have this to pick location
import { Input } from '@/components/ui/input';
import { updateDocument } from '@/services/firestoreService';

type Props = {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isAdmin?: boolean;
  eventId?: string; // Optional, if you need to update event
};

export default function EventContactMap({
  address: initialAddress,
  coordinates: initialCoordinates,
  isAdmin = false,
  eventId,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [coordinates, setCoordinates] = useState(initialCoordinates);

  // Reset local state if props change (optional)
  useEffect(() => {
    setAddress(initialAddress);
  }, [initialAddress]);

  useEffect(() => {
    setCoordinates(initialCoordinates);
  }, [initialCoordinates]);

  const onUpdate = (
    address: string,
    coordinates?: { lat: number; lng: number }
  ) => {
    if (!eventId) return;

    const updatedData: {
      address?: string;
      coordinates?: { lat: number; lng: number };
    } = {};
    if (address) updatedData.address = address;
    if (coordinates) updatedData.coordinates = coordinates;

    updateDocument('events', eventId, updatedData)
      .then(() => {
        // console.log('Event contact and map updated successfully');
      })
      .catch((error) => {
        console.error('Error updating event contact and map:', error);
      });
  };

  // Handle save action
  function handleSave() {
    if (onUpdate && coordinates) {
      onUpdate(address, coordinates);
    }
    setEditing(false);
  }

  return (
    <SectionPanel>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Contact and Map'
        updating={false}
        toggles={[]}
        uploads={[]}
        buttons={
          isAdmin
            ? [
                {
                  label: editing ? 'Cancel' : 'Edit',
                  // variant: editing ? 'outline' : undefined,
                  onClick: () => setEditing((e) => !e),
                },
                ...(editing
                  ? [
                      {
                        label: 'Save',
                        // variant: 'primary',
                        onClick: handleSave,
                      },
                    ]
                  : []),
              ]
            : []
        }
      />

      <section className='flex flex-col gap-4 md:flex-row'>
        <Card className='p-4 space-y-3 w-full md:w-1/2'>
          <h3 className='text-lg font-semibold'>Contact Info</h3>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <MapPin className='w-4 h-4' />
            {editing ? (
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder='Enter address'
              />
            ) : (
              <span>{address || 'No address provided'}</span>
            )}
          </div>
        </Card>

        <div className='w-full md:w-1/2 rounded-xl overflow-hidden min-h-[220px]'>
          {editing ? (
            <MapSelector
              // coordinates={coordinates}
              onChange={(coords, addr) => {
                setCoordinates(coords);
                if (addr) setAddress(addr);
              }}
            />
          ) : (
            coordinates && <MapDisplay coordinates={coordinates} />
          )}
        </div>
      </section>
    </SectionPanel>
  );
}
