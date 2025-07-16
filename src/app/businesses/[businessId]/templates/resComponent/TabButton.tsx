'use client';

import { Button } from '@/components/ui/button';

type Props = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

export default function TabButton({ active, children, onClick }: Props) {
  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      size='sm'
      onClick={onClick}
      className='min-w-[120px] rounded-none border-b-2 border-transparent data-[state=active]:border-primary'
    >
      {children}
    </Button>
  );
}
