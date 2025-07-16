'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBusinesses } from '@/app/lib/businessesSlice';
import type { Business } from '@/types/business';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

type Props = {
  value: Business[];
  onChange: (selected: Business[]) => void;
};

export default function BusinessSelect({ value, onChange }: Props) {
  const dispatch = useAppDispatch();
  const businesses = useAppSelector((state) => state.businesses.items);
  //   const loading = useAppSelector((state) => state.businesses.loading);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (businesses.length === 0) {
      dispatch(fetchBusinesses());
    }
  }, [dispatch, businesses.length]);

  const addBusiness = (biz: Business) => {
    if (!value.find((b) => b.id === biz.id)) {
      onChange([...value, biz]);
    }
    setOpen(false);
  };

  const removeBusiness = (id: string) => {
    onChange(value.filter((b) => b.id !== id));
  };

  return (
    <div className='space-y-2'>
      <Label>Sponsors</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant='outline'
            className='w-full justify-between'
          >
            {value.length > 0 ? 'Select more sponsors' : 'Select sponsors'}
            <span className='text-muted-foreground ml-2'>▼</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          style={{
            width: triggerRef.current?.offsetWidth,
          }}
          align='start'
          className='p-0'
        >
          <Command>
            <CommandInput placeholder='Search businesses...' />
            <CommandEmpty>No businesses found.</CommandEmpty>
            <CommandGroup>
              {businesses
                .filter((biz) => !value.some((v) => v.id === biz.id))
                .map((biz) => (
                  <CommandItem
                    key={biz.id}
                    onSelect={() => addBusiness(biz)}
                    className='cursor-pointer'
                  >
                    {biz.businessName}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-2'>
          {value.map((biz) => (
            <Badge
              key={biz.id}
              className='flex items-center gap-1 px-2 py-1'
              variant='secondary'
            >
              {biz.businessName}
              <button onClick={() => removeBusiness(biz.id)} className='ml-1'>
                <X className='w-3 h-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
