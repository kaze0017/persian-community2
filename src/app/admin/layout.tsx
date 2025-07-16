// app/admin/layout.tsx
'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen'>
      <AdminSidebar />
      <main className='flex-1 overflow-y-auto p-6 bg-muted'>{children}</main>
    </div>
  );
}
