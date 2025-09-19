// app/admin/layout.tsx
'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import HydrateReducers from '@/app/admin/components/HydrateReducers';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <HydrateReducers>
      <div className='flex h-full grow w-full max-w-[1280px] mx-auto'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </HydrateReducers>
  );
}
