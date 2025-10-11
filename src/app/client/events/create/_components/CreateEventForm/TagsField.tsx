import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
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

export default function TagsField({
  handleGenerateAIEvent,
  handleGenerateVertexAIEvent,
}: Props) {
  const { watch, setValue } = useFormContext<CreateEventFormValues>();
  const [tags, setTags] = useState<string[]>(watch('tags') || []);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  return (
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
              setTags([...tags, tagInput.trim()]);
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
      >
        <Sparkles className='w-4 h-4 text-blue-500' />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='absolute top-0 right-10'
        onClick={() => handleGenerateVertexAIEvent('tags')}
      >
        <Sparkles className='w-4 h-4 text-red-500' />
      </Button>
    </div>
  );
}
