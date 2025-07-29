import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  title,
  children,
}: SectionWrapperProps) {
  return (
    <div className={cn('p-4 w-full mb-4')}>
      <div className='flex items-center justify-between pb-2 border-b border-border'>
        <h2 className='text-2xl font-semibold text-foreground'>{title}</h2>
        <Link
          href='/businesses'
          className='text-sm font-medium text-primary hover:underline'
        >
          View All Businesses
        </Link>
      </div>
      <div className='pt-4'>{children}</div>
    </div>
  );
}
