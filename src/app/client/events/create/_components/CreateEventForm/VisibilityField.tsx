import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function VisibilityField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { register } = useFormContext<CreateEventFormValues>();

  return (
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
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('isPublic')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
