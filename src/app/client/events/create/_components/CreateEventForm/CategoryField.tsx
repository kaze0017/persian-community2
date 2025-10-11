import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { CreateEventFormValues } from './types';

type Props = {
  categories: { id: string; name: string }[];
  handleGenerateAIEvent: (section: keyof CreateEventFormValues | 'all') => void;
  handleGenerateVertexAIEvent: (
    section: keyof CreateEventFormValues | 'all'
  ) => void;
};

export default function CategoryField({
  categories,
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { setValue } = useFormContext<CreateEventFormValues>();

  return (
    <div className='relative'>
      <label className='block font-medium mb-1'>Category</label>
      <Select onValueChange={(value) => setValue('category', value)}>
        <SelectTrigger>
          <SelectValue placeholder='Select category' />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
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
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('category')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
