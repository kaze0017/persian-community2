'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Utensils,
  Building,
  Wrench,
  Palette, // for Art
  Hammer, // for Mechanic
  Scissors, // for Barber
  MoreHorizontal, // for Other
  Gavel, // for Lawyer
  Monitor, // for Computer/IT
  Plus,
} from 'lucide-react';
import { Category } from '@/types/category';

const availableIcons = [
  { name: 'Utensils', component: Utensils },
  { name: 'Building', component: Building },
  { name: 'Wrench', component: Wrench },
  { name: 'Art', component: Palette },
  { name: 'Mechanic', component: Hammer },
  { name: 'Barber', component: Scissors },
  { name: 'Other', component: MoreHorizontal },
  { name: 'Lawyer', component: Gavel },
  { name: 'Computer/IT', component: Monitor },
];

type Props = {
  onAdd: (cat: Category) => void;
};

export default function AddCategoryCard({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Utensils');
  const handleSubmit = () => {
    if (!name) return;

    // const camelName = toCamelCase(name);
    const camelName = name;

    onAdd({
      id: Date.now().toString(),
      name: camelName,
      icon: selectedIcon,
    });

    setName('');
    setSelectedIcon('Utensils');
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='border border-dashed border-gray-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'>
          <Plus className='w-6 h-6 mb-2' />
          <span>Add Category</span>
        </div>
      </DialogTrigger>

      <DialogContent className='space-y-4'>
        <h2 className='text-xl font-semibold'>Add Category</h2>

        <Input
          placeholder='Category name'
          value={name}
          onChange={(e) => setName(e.target.value)}
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

        <Button onClick={handleSubmit} disabled={!name.trim()}>
          Add Category
        </Button>
      </DialogContent>
    </Dialog>
  );
}
