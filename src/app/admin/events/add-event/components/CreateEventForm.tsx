'use client';

import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createEvent } from '@/app/admin/events/reducer/eventsSlice';
import { Event } from '@/types/event';
import { useRouter } from 'next/navigation';

import MapSelector from '@/app/admin/MapSelector';
import BusinessSelect from '@/components/BusinessSelector';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCategories } from '@/app/lib/categoriesSlice';
import EventDaysBuilder from './EventDaysBuilder';

type CreateEventFormValues = Omit<Event, 'id'>;

export default function CreateEventForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.events);
  const { categories } = useAppSelector((state) => state.categories);

  // Fetch categories once on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const methods = useForm<CreateEventFormValues>({
    defaultValues: {
      coordinates: { lat: 0, lng: 0 },
      tags: [],
      organizers: [],
      isPublic: true,
      days: [],
    },
  });

  const { register, handleSubmit, setValue, control, watch } = methods;
  const sponsors = watch('sponsors') || [];

  const {
    fields: organizerFields,
    append: appendOrganizer,
    remove: removeOrganizer,
  } = useFieldArray({
    control,
    name: 'organizers',
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      // 🔁 Parse activity strings to arrays
      if (Array.isArray(data.days)) {
        data.days = data.days.map((day) => ({
          ...day,
          blocks: Array.isArray(day.blocks)
            ? day.blocks.map((block) => ({
                ...block,
                activities:
                  typeof block.activities === 'string'
                    ? block.activities
                        .split(',')
                        .map((a) => a.trim())
                        .filter((a) => a.length > 0)
                    : block.activities || [],
              }))
            : [],
        }));
      }

      const resultAction = await dispatch(
        createEvent({ event: data, bannerFile: bannerFile ?? undefined })
      );
      if (createEvent.fulfilled.match(resultAction)) {
        router.push('/admin/events');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6 max-w-3xl mx-auto p-6 border rounded-xl shadow'
      >
        <h2 className='text-2xl font-semibold'>Create New Event</h2>

        <div>
          <label className='block font-medium mb-1'>Title</label>
          <Input {...register('title', { required: 'Title is required' })} />
        </div>

        <div>
          <label className='block font-medium mb-1'>Description</label>
          <Textarea {...register('description')} rows={3} />
        </div>
        <div className='flex items-center space-x-2 mt-2'>
          <input
            type='checkbox'
            id='isFeatured'
            {...register('isFeatured')}
            className='accent-primary h-4 w-4'
          />
          <label htmlFor='isFeatured' className='text-sm font-medium'>
            Mark as Featured
          </label>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div>
            <label className='block font-medium mb-1'>Date</label>
            <Input type='date' {...register('date', { required: true })} />
          </div>
          <div>
            <label className='block font-medium mb-1'>Time</label>
            <Input type='time' {...register('time', { required: true })} />
          </div>
        </div>
        <EventDaysBuilder />

        <div>
          <label className='block font-medium mb-1'>Location</label>
          <Input {...register('location')} />
        </div>

        <div>
          <label className='block font-medium mb-1'>Address</label>
          <Input {...register('address')} />
        </div>

        <MapSelector
          onChange={(coords, address) => {
            setValue('coordinates.lat', coords.lat);
            setValue('coordinates.lng', coords.lng);
            setValue('address', address || '');
          }}
        />

        <div>
          <label className='block font-medium mb-1'>Category</label>
          <Select onValueChange={(value) => setValue('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block font-medium mb-1'>Latitude</label>
            <Input
              type='number'
              step='any'
              {...register('coordinates.lat', { valueAsNumber: true })}
            />
          </div>
          <div>
            <label className='block font-medium mb-1'>Longitude</label>
            <Input
              type='number'
              step='any'
              {...register('coordinates.lng', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <label className='block font-medium mb-1'>Event Banner</label>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBannerFile(file);
              }
            }}
          />
        </div>
        {bannerFile && (
          <Image
            src={URL.createObjectURL(bannerFile)}
            alt='Banner Preview'
            className='mt-2 max-h-48 object-cover rounded-lg'
            width={300}
            height={150}
          />
        )}

        {/* Sponsors */}
        <BusinessSelect
          value={sponsors}
          onChange={(selected) => setValue('sponsors', selected)}
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
                }
              }}
            >
              <Plus className='w-4 h-4 mr-1' /> Add Tag
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
                  onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className='w-4 h-4 text-red-500' />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Organizers */}
        <div>
          <label className='block font-medium mb-2'>Organizers</label>
          <div className='space-y-4'>
            {organizerFields.map((field, index) => (
              <div
                key={field.id}
                className='border p-4 rounded-xl relative space-y-2'
              >
                <div>
                  <label className='block text-sm'>Name</label>
                  <Input {...register(`organizers.${index}.name`)} />
                </div>
                <div>
                  <label className='block text-sm'>Contact</label>
                  <Input {...register(`organizers.${index}.contact`)} />
                </div>
                <div>
                  <label className='block text-sm'>Image URL (optional)</label>
                  <Input {...register(`organizers.${index}.imageUrl`)} />
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => removeOrganizer(index)}
                  className='absolute top-2 right-2 text-red-500'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                appendOrganizer({ name: '', contact: '', imageUrl: '' })
              }
            >
              <Plus className='w-4 h-4 mr-1' /> Add Organizer
            </Button>
          </div>
        </div>

        {/* Public toggle */}
        <div className='pt-2'>
          <label className='flex items-center gap-2'>
            <input type='checkbox' {...register('isPublic')} />
            <span>Make this a public event</span>
          </label>
        </div>

        {error && <p className='text-red-500'>{error}</p>}

        <Button type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </form>
    </FormProvider>
  );
}
