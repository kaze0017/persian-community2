import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
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

export default function DescriptionField({
  previousEvents,
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { register } = useFormContext<CreateEventFormValues>();
  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>Description</label>
      <Textarea {...register('description')} rows={3} />
      <Button
        type='button'
        variant='ghost'
        className='absolute top-0 right-0'
        onClick={() => handleGenerateAIEvent('description')}
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('description')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
