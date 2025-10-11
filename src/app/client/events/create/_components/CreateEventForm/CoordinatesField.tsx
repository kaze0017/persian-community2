import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function CoordinatesField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { register } = useFormContext<CreateEventFormValues>();

  return (
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
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('coordinates')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
