import React from 'react';
import { PlusIcon } from 'lucide-react';
interface TabTitleProps {
  title: string;
  hasAddBtn?: boolean;
  onAddType?: () => void;
  addBtnTitle?: string;
}

export default function TabTitle({
  title,
  onAddType,
  addBtnTitle,
  hasAddBtn,
}: TabTitleProps) {
  return (
    <div className='flex items-center justify-between'>
      <h2 className='text-xl font-bold'>{title}</h2>
      {hasAddBtn && (
        <button
          onClick={onAddType}
          className='btn btn-outline flex items-center gap-2'
        >
          <PlusIcon className='w-4 h-4' /> {addBtnTitle || 'Add New Type'}
        </button>
      )}
    </div>
  );
}
