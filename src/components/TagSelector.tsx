'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

type Props = {
  value: string[];
  onChange: (tags: string[]) => void;
};

export default function TagSelector({ value, onChange }: Props) {
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className='space-y-2'>
      <Label>Tags</Label>
      <div className='flex gap-2'>
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Add a tag...'
        />
        <Button type='button' onClick={addTag}>
          Add
        </Button>
      </div>
      <div className='flex flex-wrap gap-2 mt-2'>
        {value.map((tag) => (
          <Badge
            key={tag}
            className='flex items-center gap-1 px-2 py-1'
            variant='secondary'
          >
            {tag}
            <button onClick={() => removeTag(tag)} className='ml-1'>
              <X className='w-3 h-3' />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
