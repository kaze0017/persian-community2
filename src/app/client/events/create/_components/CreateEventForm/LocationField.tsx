import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MapSelector from '@/app/admin/MapSelector';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function LocationField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { register, setValue } = useFormContext<CreateEventFormValues>();
  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>Location</label>
      <Input {...register('location')} />
      <Button
        type='button'
        variant='ghost'
        className='absolute top-0 right-0'
        onClick={() => handleGenerateAIEvent('location')}
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('location')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>

      <MapSelector
        onChange={(coords, address) => {
          setValue('coordinates.lat', coords.lat);
          setValue('coordinates.lng', coords.lng);
          setValue('address', address || '');
        }}
      />
    </div>
  );
}
