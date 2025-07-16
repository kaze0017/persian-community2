'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, ImageIcon } from 'lucide-react';
import { Occasion } from '@/types/occasions';

const availableIcons = [
  { name: 'Calendar', component: CalendarDays },
  { name: 'Image', component: ImageIcon },
  // Add more icons if needed
];

type Props = {
  onAdd: (occasion: Occasion) => void;
};

export default function AddOccasionCard({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Calendar');
  const [imageURL, setImageURL] = useState('');

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) return;

    const newOccasion: Occasion = {
      id: Date.now().toString(),
      title: trimmedTitle,
      description: trimmedDescription,
    };

    if (date) newOccasion.date = date;
    if (selectedIcon) newOccasion.icon = selectedIcon;
    if (imageURL.trim()) newOccasion.imageURL = imageURL.trim();

    onAdd(newOccasion);

    // Reset state
    setTitle('');
    setDescription('');
    setDate('');
    setImageURL('');
    setSelectedIcon('Calendar');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='rounded-lg border p-4 shadow-sm bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col items-center justify-center h-full min-h-[148px] text-muted-foreground'>
          <Plus className='w-6 h-6 mb-2' />
          <span className='text-sm font-medium'>Add Occasion</span>
        </div>
      </DialogTrigger>

      <DialogContent className='space-y-4'>
        <DialogTitle className='text-xl font-semibold'>
          Add Occasion
        </DialogTitle>

        <Input
          placeholder='Title (e.g. Nowruz)'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          placeholder='Image URL (optional)'
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />

        <div className='flex flex-wrap gap-3'>
          {availableIcons.map(({ name, component: Icon }) => (
            <Button
              key={name}
              variant={selectedIcon === name ? 'default' : 'outline'}
              onClick={() => setSelectedIcon(name)}
              className='flex items-center gap-1 px-3'
            >
              <Icon className='w-4 h-4' />
              {name}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
        >
          Add Occasion
        </Button>
      </DialogContent>
    </Dialog>
  );
}
