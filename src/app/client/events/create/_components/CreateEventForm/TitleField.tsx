import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  previousEvents: Partial<CreateEventFormValues>[];
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function TitleField({
  previousEvents,
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { register } = useFormContext<CreateEventFormValues>();

  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>Title</label>
      <Input {...register('title', { required: 'Title is required' })} />
      <Button
        type='button'
        variant='ghost'
        className='absolute top-0 right-0'
        onClick={() => handleGenerateAIEvent('title')}
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('title')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
