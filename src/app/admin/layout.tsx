// app/admin/layout.tsx
'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import HydrateReducers from './components/HydrateReducers';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <HydrateReducers>
      <div className='flex h-screen'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto p-6 bg-muted'>{children}</main>
      </div>
    </HydrateReducers>
  );
}
