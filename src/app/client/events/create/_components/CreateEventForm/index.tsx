'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useRouter } from 'next/navigation';
import { addUserEvent } from '@/app/client/events/clientEventsReducer';
import { fetchCategories } from '@/app/lib/categoriesSlice';
import { useEffect, useState } from 'react';
import { CreateEventFormValues } from './types';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import DateTimeField from './DateTimeField';
import LocationField from './LocationField';
import CategoryField from './CategoryField';
import CoordinatesField from './CoordinatesField';
import BannerField from './BannerField';
import InspirationImageField from './InspirationImageField';
import SponsorsField from './SponsorsField';
import TagsField from './TagsField';
import OrganizersField from './OrganizersField';
import VisibilityField from './VisibilityField';
import EventDaysBuilder from './EventDaysBuilder';
import { Button } from '@/components/ui/button';

export default function CreateEventForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.events);
  const { categories } = useAppSelector((state) => state.categories);
  const client = useAppSelector((state) => state.user);
  const clientId = client.uid || '';

  const [previousEvents, setPreviousEvents] = useState<
    Partial<CreateEventFormValues>[]
  >([]);
  const [bannerFile, setBannerFile] = useState<File>();
  const [inspirationImage, setInspirationImage] = useState<File>();
  const [imageText, setImageText] = useState<string>('');

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

  const { handleSubmit, setValue, getValues } = methods;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const onSubmit = async (data: CreateEventFormValues) => {
    try {
      const resultAction = await dispatch(
        addUserEvent({ clientId, event: data, bannerFile })
      );
      if (addUserEvent.fulfilled.match(resultAction)) {
        router.push('/client/events');
      }
    } catch (err) {
      console.error('Error submitting event:', err);
    }
  };

  const handleGenerateAIEvent = async (
    section: keyof CreateEventFormValues | 'all'
  ) => {
    try {
      const currentValues = getValues();
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
      if (!res.ok) return;
      const aiEvent = await res.json();
      Object.keys(aiEvent).forEach((key) =>
        setValue(key as keyof CreateEventFormValues, aiEvent[key])
      );
    } catch (err) {
      console.error('Error generating OpenAI event:', err);
    }
  };

  const handleGenerateVertexAIEvent = async (
    section: keyof CreateEventFormValues | 'all'
  ) => {
    try {
      const currentValues = getValues();
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
      if (!res.ok) return;
      const vertexEvent = await res.json();
      Object.keys(vertexEvent).forEach((key) =>
        setValue(key as keyof CreateEventFormValues, vertexEvent[key])
      );
    } catch (err) {
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

        <TitleField
          previousEvents={previousEvents}
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <DescriptionField
          previousEvents={previousEvents}
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <DateTimeField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <EventDaysBuilder />
        <LocationField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <CategoryField
          categories={categories}
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <CoordinatesField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <BannerField setBannerFile={setBannerFile} />
        <InspirationImageField
          setInspirationImage={setInspirationImage}
          imageText={imageText}
          setImageText={setImageText}
        />
        <SponsorsField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <TagsField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <OrganizersField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />
        <VisibilityField
          handleGenerateAIEvent={handleGenerateAIEvent}
          handleGenerateVertexAIEvent={handleGenerateVertexAIEvent}
        />

        {error && <p className='text-red-500'>{error}</p>}

        <div className='flex gap-4'>
          <Button type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => handleGenerateAIEvent('all')}
          >
            OpenAI Full Event
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => handleGenerateVertexAIEvent('all')}
          >
            Vertex AI Full Event
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
