import { useFormContext } from 'react-hook-form';
import BusinessSelect from '@/components/BusinessSelector';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function SponsorsField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { watch, setValue } = useFormContext<CreateEventFormValues>();
  const sponsors = watch('sponsors') || [];

  return (
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
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('sponsors')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
