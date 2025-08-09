import React from 'react';
import Link from 'next/link';

export default function SectionHeader({
  header,
  linkPath,
}: {
  header: string;
  linkPath: string;
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0 mx-2'>
      <div className='w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4'>
        <h2 className='text-2xl font-semibold text-foreground w-[150px]'>
          {header}
        </h2>

        <div className='flex-1 h-2 sm:w-px bg-border mx-4 rounded-full' />

        <Link
          href={`/${linkPath}`}
          className='text-sm font-medium text-primary hover:underline w-[150px] text-right'
        >
          View All
        </Link>
      </div>
    </div>
  );
}
