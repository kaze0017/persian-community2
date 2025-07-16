'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Plus, RefreshCcw } from 'lucide-react';

type Props = {
  addLabel?: string;
  onAdd?: () => void;
  showAdd?: boolean;

  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  filterValue?: string;
  onFilterChange?: (val: string) => void;
  filterOptions?: string[];
  showFilter?: boolean;

  onRefresh?: () => void;
  showRefresh?: boolean;

  disabled?: boolean;
};

export default function ListHeader({
  addLabel = 'Add',
  onAdd,
  showAdd = true,

  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  showSearch = true,

  filterValue,
  onFilterChange,
  filterOptions = [],
  showFilter = true,

  onRefresh,
  showRefresh = true,

  disabled = false,
}: Props) {
  return (
    <div className='flex flex-wrap md:flex-nowrap items-center justify-between gap-4'>
      <div className='flex flex-wrap md:flex-nowrap gap-2 items-center flex-1'>
        {showAdd && onAdd && (
          <Button onClick={onAdd} className='min-w-[180px]'>
            <Plus className='w-4 h-4 mr-2' /> {addLabel}
          </Button>
        )}

        {showSearch && onSearchChange !== undefined && (
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className='w-full md:max-w-xs'
          />
        )}

        {showFilter && onFilterChange && (
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Filter by category' />
            </SelectTrigger>
            <SelectContent>
              {['All', ...filterOptions].map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {showRefresh && onRefresh && (
        <div className='flex items-center'>
          <Button
            variant='outline'
            onClick={onRefresh}
            aria-label='Refresh List'
            disabled={disabled}
          >
            <RefreshCcw className='w-4 h-4' />
          </Button>
        </div>
      )}
    </div>
  );
}
