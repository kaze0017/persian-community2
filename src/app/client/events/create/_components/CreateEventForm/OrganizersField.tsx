import { useFormContext, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function OrganizersField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { control, register } = useFormContext<CreateEventFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'organizers',
  });

  return (
    <div className='relative'>
      <label className='block font-medium mb-2'>Organizers</label>
      <div className='space-y-4'>
        {fields.map((field, index) => (
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
              onClick={() => remove(index)}
              className='absolute top-2 right-2 text-red-500'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        ))}
        <Button
          type='button'
          variant='outline'
          onClick={() => append({ name: '', contact: '', imageUrl: '' })}
        >
          <Plus className='w-4 h-4 mr-1' /> Add Organizer
        </Button>
      </div>
      <Button
        type='button'
        variant='ghost'
        className='absolute top-0 right-0'
        onClick={() => handleGenerateAIEvent('organizers')}
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('organizers')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
