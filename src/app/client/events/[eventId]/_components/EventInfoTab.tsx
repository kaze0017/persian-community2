'use client';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppSelector } from '@/app/hooks';
import { Event } from '@/types/event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MapSelector from '@/app/admin/MapSelector';
import BusinessSelect from '@/components/BusinessSelector';
import { Trash2, Plus } from 'lucide-react';
import { uploadImage } from '@/services/storageService';
import { updateEvent } from '@/app/client/events/eventsApi';
import { GlassImageUpload } from '@/app/client/businesses/_components/GlassInputs';
import { Business } from '@/types/business';

type EventInfoValues = {
  title: string;
  description: string;
  address: string;
  contact: string;
  coordinates: { lat?: number | undefined; lng?: number | undefined };
  sponsors: Business[];
  tags: string[];
};

export default function EventInfoTab({
  clientId,
  event,
  onSubmit,
}: {
  clientId: string;
  event: Event | undefined;
  onSubmit: (data: Partial<Event>) => void;
}) {
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [tags, setTags] = useState<string[]>(event?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [dirty, setDirty] = useState(false);

  const { register, handleSubmit, setValue, reset } = useForm<EventInfoValues>({
    defaultValues: {
      title: '',
      description: '',
      address: '',
      contact: '',
      coordinates: { lat: undefined, lng: undefined },
      sponsors: [],
      tags: [],
    },
  });

  // Register with dirty flag
  const registerWithDirty = (name: keyof EventInfoValues) => ({
    ...register(name),
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      register(name).onChange(e);
      setDirty(true);
    },
  });

  const handleFormSubmit: SubmitHandler<EventInfoValues> = async (data) => {
    if (!event) return;

    try {
      const updates: Partial<Event> = { ...data, tags };
      console.log(
        'Submitting form with data:',
        data,
        'event:',
        event,
        'bannerFile:',
        bannerFile
      );
      // Upload banner if changed
      // if (bannerFile) {
      //   const url = await uploadImage(
      //     bannerFile,
      //     `clients/${clientId}/events/${event?.id}/banner`,
      //     'banner.jpg'
      //   );
      //   updates.bannerUrls = {
      //     sizes: { large: url, medium: url, small: url, xlarge: url },
      //   };
      // }
      await updateEvent(clientId, event.id, updates, bannerFile);
      onSubmit(updates);
      setDirty(false);
    } catch (err) {
      console.error('❌ Failed to update event:', err);
    }
  };

  useEffect(() => {
    console.log('Updating form with event:', event);
    if (event) {
      reset({
        title: event.title || '',
        description: event.description || '',
        address: event.address || '',
        // contact: event.contact || '',
        coordinates: {
          lat: event.coordinates?.lat,
          lng: event.coordinates?.lng,
        },
        // sponsors: event.sponsors || [],
        tags: event.tags || [],
      });
      setTags(event.tags || []);
      setDirty(false);
    }
  }, [event, reset]);
  useEffect(() => {
    console.log(' event:', event);
  }, [event]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className='space-y-6 relative'
    >
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Event Info</h3>
        <p className='text-sm text-muted-foreground'>
          Edit general event details here (title, description, sponsors, tags,
          address, contact, banner).
        </p>

        {/* Title + Contact */}
        <Input
          placeholder='Event Title'
          {...registerWithDirty('title')}
          className='w-full'
        />
        <Input
          placeholder='Contact (email or phone)'
          {...registerWithDirty('contact')}
          className='w-full'
        />

        {/* Description */}
        <Textarea
          placeholder='Event description...'
          rows={3}
          {...registerWithDirty('description')}
        />

        {/* Address + Map */}
        <Input
          placeholder='Event Address'
          {...registerWithDirty('address')}
          className='w-full'
        />
        <MapSelector
          onChange={(coords, address) => {
            setValue('coordinates.lat', coords.lat);
            setValue('coordinates.lng', coords.lng);
            setValue('address', address || '');
            setDirty(true);
          }}
        />

        {/* Banner */}
        <div>
          <label className='block font-medium mb-1'>Banner</label>
          {/* <Input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBannerFile(file);
                setDirty(true);
              }
            }}
          />
          {bannerFile && (
            <img
              src={URL.createObjectURL(bannerFile)}
              alt='Banner Preview'
              className='mt-2 max-h-48 rounded-lg object-cover'
            />
          )} */}
          <GlassImageUpload
            label='Event Banner'
            wide
            defaultImage={
              event?.bannerUrls?.sizes.large ||
              '/images/placeholders/business_banner.webp'
            }
            onChange={(e) => {
              const file = e.target.files?.[0] || undefined;
              setBannerFile(file);
              //   setChanged((prev) => ({ ...prev, banner: true }));
              setDirty(true);
            }}
          />
        </div>

        {/* Sponsors */}
        <BusinessSelect
          value={event?.sponsors || []}
          onChange={(selected) => {
            setValue('sponsors', selected);
            setDirty(true);
          }}
        />

        {/* Tags */}
        <div>
          <label className='block font-medium mb-2'>Tags</label>
          <div className='flex gap-2 mb-2'>
            <Input
              placeholder='Enter tag'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button
              type='button'
              onClick={() => {
                if (tagInput.trim()) {
                  setTags((prev) => [...prev, tagInput.trim()]);
                  setTagInput('');
                  setDirty(true);
                }
              }}
            >
              <Plus className='w-4 h-4 mr-1' /> Add
            </Button>
          </div>
          <div className='flex flex-wrap gap-2'>
            {tags.map((tag, i) => (
              <div
                key={i}
                className='px-2 py-1 bg-gray-200 rounded flex items-center gap-2'
              >
                {tag}
                <button
                  type='button'
                  onClick={() => {
                    setTags(tags.filter((_, idx) => idx !== i));
                    setDirty(true);
                  }}
                >
                  <Trash2 className='w-4 h-4 text-red-500' />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      {dirty && (
        <div className='sticky bottom-4 right-0 flex justify-end gap-3 px-2'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => {
              reset();
              setDirty(false);
            }}
          >
            Discard
          </Button>
          <Button type='submit'>Save</Button>
        </div>
      )}
    </form>
  );
}
