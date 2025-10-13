'use client';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
// import { createEvent } from '@/app/admin/events/reducer/eventsSlice';
// import { addUserEvent } from '@/app/client/events/clientEventsReducer';
import { Event } from '@/types/event';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCategories } from '@/app/lib/categoriesSlice';
import EventDaysBuilder from './EventDaysBuilder';
import { addUserEvent } from '@/app/client/events/clientEventsReducer';
import { add } from 'date-fns';
import { generateAIEvent } from '../utils/generateAIEvent';

type CreateEventFormValues = Omit<Event, 'id'>;

export default function CreateEventForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const { loading, error } = useAppSelector((state) => state.events);
  const loading = false;
  const error = false;
  const { categories } = useAppSelector((state) => state.categories);
  const client = useAppSelector((state) => state.user);
  const clientId = client.uid || '';

  const [previousEvents, setPreviousEvents] = useState<Partial<Event>[]>([]);
  const [bannerFile, setBannerFile] = useState<File | undefined>();
  const [inspirationImage, setInspirationImage] = useState<File | undefined>();
  const [imageText, setImageText] = useState<string>('');

  // Fetch previous events on mount
  useEffect(() => {
    const fetchPreviousEvents = async () => {
      try {
        const q = query(
          collection(db, 'events'),
          where('clientId', '==', clientId),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(
          (doc) => doc.data() as Partial<Event>
        );
        setPreviousEvents(events);
      } catch (err) {
        console.error('Error fetching previous events:', err);
      }
    };
    if (clientId) {
      fetchPreviousEvents();
    }
  }, [clientId]);

  // Process inspiration image via API route
  useEffect(() => {
    const processImage = async () => {
      if (!inspirationImage) {
        setImageText('');
        return;
      }
      try {
        const formData = new FormData();
        formData.append('image', inspirationImage);
        const res = await fetch('/api/process-image', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          throw new Error('Failed to process image');
        }
        const { text } = await res.json();
        setImageText(text || '');
      } catch (err) {
        console.error('Error processing image:', err);
        setImageText('');
      }
    };
    processImage();
  }, [inspirationImage]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const methods = useForm<CreateEventFormValues>({
    defaultValues: {
      coordinates: { lat: 0, lng: 0 },
      tags: [],
      organizers: [],
      isPublic: true,
      isOnline: false,
      days: [],
      isFeatured: false,
      eventConfig: {
        scheduleConfig: { isEnabled: true },
        contactConfig: { isEnabled: true },
        organizersConfig: { isEnabled: true },
        sponsorsConfig: { isEnabled: true },
        layoutConfig: { isEnabled: true },
        tagsConfig: { isEnabled: true },
        ticketsConfig: { isEnabled: true },
      },
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

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
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
        addUserEvent({ clientId: clientId, event: data, bannerFile })
      );
      if (addUserEvent.fulfilled.match(resultAction)) {
        router.push('/client/events');
      }
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleGenerateAIEvent = async (
    section: keyof CreateEventFormValues | 'all'
  ) => {
    try {
      const currentValues = methods.getValues();
      const res = await fetch('/api/generate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentValues,
          section,
          previousEvents,
          imageText,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to generate OpenAI event:', errorData);
        return;
      }

      const aiEvent = await res.json();
      let { date, time } = aiEvent;
      if (date && date.includes('T') && !time) {
        const dateTime = new Date(date);
        date = dateTime.toISOString().split('T')[0];
        time = dateTime.toISOString().split('T')[1].slice(0, 5);
      }

      setValue('title', aiEvent.title || '');
      setValue('description', aiEvent.description || '');
      setValue('date', date || '');
      setValue('time', time || '');
      setValue('location', aiEvent.location || '');
      setValue('category', aiEvent.category || 'General');
      setValue('address', aiEvent.address || '');
      setValue('coordinates.lat', aiEvent.coordinates?.lat || 0);
      setValue('coordinates.lng', aiEvent.coordinates?.lng || 0);
      setValue('tags', aiEvent.tags || []);
      setValue('sponsors', aiEvent.sponsors || []);
      setValue(
        'organizers',
        aiEvent.organizers ||
          (aiEvent.organizer
            ? [
                {
                  name: aiEvent.organizer.name || '',
                  contact: aiEvent.organizer.contact || '',
                },
              ]
            : [])
      );
      setValue('isPublic', aiEvent.isPublic ?? true);
      setValue('isOnline', aiEvent.isOnline ?? false);
      setValue('days', aiEvent.days || []);
      setValue('isFeatured', aiEvent.isFeatured ?? false);
      setValue('eventLayoutUrl', aiEvent.eventLayoutUrl || undefined);
      setValue(
        'eventConfig',
        aiEvent.eventConfig || {
          scheduleConfig: { isEnabled: true },
          contactConfig: { isEnabled: true },
          organizersConfig: { isEnabled: true },
          sponsorsConfig: { isEnabled: true },
          layoutConfig: { isEnabled: true },
          tagsConfig: { isEnabled: true },
          ticketsConfig: { isEnabled: true },
        }
      );

      if (aiEvent.tags) {
        setTags(aiEvent.tags);
      }

      console.log('OpenAI event generated for section:', section, aiEvent);
    } catch (err: unknown) {
      console.error('Error generating OpenAI event:', err);
    }
  };

  const handleGenerateVertexAIEvent = async (
    section: keyof CreateEventFormValues | 'all'
  ) => {
    try {
      const currentValues = methods.getValues();
      const res = await fetch('/api/generate-vertex-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentValues,
          section,
          previousEvents,
          imageText,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to generate Vertex AI event:', errorData);
        return;
      }

      const vertexEvent = await res.json();
      let { date, time } = vertexEvent;
      if (date && date.includes('T') && !time) {
        const dateTime = new Date(date);
        date = dateTime.toISOString().split('T')[0];
        time = dateTime.toISOString().split('T')[1].slice(0, 5);
      }

      setValue('title', vertexEvent.title || '');
      setValue('description', vertexEvent.description || '');
      setValue('date', date || '');
      setValue('time', time || '');
      setValue('location', vertexEvent.location || '');
      setValue('category', vertexEvent.category || 'General');
      setValue('address', vertexEvent.address || '');
      setValue('coordinates.lat', vertexEvent.coordinates?.lat || 0);
      setValue('coordinates.lng', vertexEvent.coordinates?.lng || 0);
      setValue('tags', vertexEvent.tags || []);
      setValue('sponsors', vertexEvent.sponsors || []);
      setValue(
        'organizers',
        vertexEvent.organizers ||
          (vertexEvent.organizer
            ? [
                {
                  name: vertexEvent.organizer.name || '',
                  contact: vertexEvent.organizer.contact || '',
                },
              ]
            : [])
      );
      setValue('isPublic', vertexEvent.isPublic ?? true);
      setValue('isOnline', vertexEvent.isOnline ?? false);
      setValue('days', vertexEvent.days || []);
      setValue('isFeatured', vertexEvent.isFeatured ?? false);
      setValue('eventLayoutUrl', vertexEvent.eventLayoutUrl || undefined);
      setValue(
        'eventConfig',
        vertexEvent.eventConfig || {
          scheduleConfig: { isEnabled: true },
          contactConfig: { isEnabled: true },
          organizersConfig: { isEnabled: true },
          sponsorsConfig: { isEnabled: true },
          layoutConfig: { isEnabled: true },
          tagsConfig: { isEnabled: true },
          ticketsConfig: { isEnabled: true },
        }
      );

      if (vertexEvent.tags) {
        setTags(vertexEvent.tags);
      }

      console.log(
        'Vertex AI event generated for section:',
        section,
        vertexEvent
      );
    } catch (err: unknown) {
      console.error('Error generating Vertex AI event:', err);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-6 max-w-3xl mx-auto p-6 border rounded-xl shadow'
      >
        <h2 className='text-2xl font-semibold'>Create New Event</h2>

        <div className='relative'>
          <label className='block font-medium mb-1'>Title</label>
          <Input {...register('title', { required: 'Title is required' })} />
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('title')}
            title='Generate OpenAI Title'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='relative'>
          <label className='block font-medium mb-1'>Description</label>
          <Textarea {...register('description')} rows={3} />
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('description')}
            title='Generate OpenAI Description'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
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

        <div className='grid md:grid-cols-2 gap-4 relative'>
          <div>
            <label className='block font-medium mb-1'>Date</label>
            <Input type='date' {...register('date', { required: true })} />
          </div>
          <div>
            <label className='block font-medium mb-1'>Time</label>
            <Input type='time' {...register('time', { required: true })} />
          </div>
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('date')}
            title='Generate OpenAI Date/Time'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>
        <EventDaysBuilder />

        <div className='relative'>
          <label className='block font-medium mb-1'>Location</label>
          <Input {...register('location')} />
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('location')}
            title='Generate OpenAI Location'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='relative'>
          <label className='block font-medium mb-1'>Address</label>
          <Input {...register('address')} />
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('address')}
            title='Generate OpenAI Address'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <MapSelector
          onChange={(coords, address) => {
            setValue('coordinates.lat', coords.lat);
            setValue('coordinates.lng', coords.lng);
            setValue('address', address || '');
          }}
        />

        <div className='relative'>
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
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('category')}
            title='Generate OpenAI Category'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-4 relative'>
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
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('coordinates')}
            title='Generate OpenAI Coordinates'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='relative'>
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

        <div className='relative'>
          <label className='block font-medium mb-1'>
            Inspiration Image (Optional)
          </label>
          <Input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setInspirationImage(file);
              } else {
                setInspirationImage(undefined);
                setImageText('');
              }
            }}
          />
        </div>
        {inspirationImage && (
          <Image
            src={URL.createObjectURL(inspirationImage)}
            alt='Inspiration Image Preview'
            className='mt-2 max-h-48 object-cover rounded-lg'
            width={300}
            height={150}
          />
        )}
        {imageText && (
          <div className='mt-2'>
            <label className='block font-medium mb-1'>
              Extracted Image Text
            </label>
            <Textarea value={imageText} readOnly rows={3} />
          </div>
        )}

        <div className='relative'>
          <BusinessSelect
            value={sponsors}
            onChange={(selected) => setValue('sponsors', selected)}
          />
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('sponsors')}
            title='Generate OpenAI Sponsors'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='relative'>
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
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('tags')}
            title='Generate OpenAI Tags'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='relative'>
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
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('organizers')}
            title='Generate OpenAI Organizers'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        <div className='pt-2 relative'>
          <label className='flex items-center gap-2'>
            <input type='checkbox' {...register('isPublic')} />
            <span>Make this a public event</span>
          </label>
          <Button
            type='button'
            variant='ghost'
            className='absolute top-0 right-0'
            onClick={() => handleGenerateAIEvent('isPublic')}
            title='Generate OpenAI Event Settings'
          >
            <Sparkles className='w-4 h-4 text-blue-500' />
          </Button>
        </div>

        {error && <p className='text-red-500'>{error}</p>}

        <div className='flex gap-4'>
          <Button type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleGenerateAIEvent('all')}
            >
              <Sparkles className='w-4 h-4 mr-1 text-blue-500' /> OpenAI Full
              Event
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleGenerateVertexAIEvent('all')}
            >
              <Sparkles className='w-4 h-4 mr-1 text-red-500' /> Vertex AI Full
              Event
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
