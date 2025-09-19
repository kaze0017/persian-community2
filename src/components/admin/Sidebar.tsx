'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClientSidebar from './subComponents/ClientSidebar';
import AdminSidebar from './subComponents/AdminSidebar';
import { useAppSelector } from '@/app/hooks';

export default function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const client = true;
  const authclient = useAppSelector((state) => state.user);
  React.useEffect(() => {
    console.log('authclient from sidebar', authclient);
  }, [authclient]);

  return (
    <aside
      className={cn(
        'flex flex-col h-[100] border-r  transition-all duration-300 ease-in-out p-2',
        collapsed ? 'w-16 p-2' : 'w-68 p-4'
      )}
    >
      <div className='flex items-center justify-between mb-4 h-20'>
        {!collapsed && <h2 className='text-lg font-bold'>Admin Panel</h2>}
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setCollapsed(!collapsed)}
          className='ml-auto'
        >
          {collapsed ? (
            <ChevronRight className='w-5 h-5' />
          ) : (
            <ChevronLeft className='w-5 h-5' />
          )}
        </Button>
      </div>
      {!client && (
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {client && (
        <ClientSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          user={{
            id: authclient.uid || '',
            name: authclient.displayName || '',
            photoUrl: authclient.photoURL || '',
            email: authclient.email || '',
            businesses: authclient.businesses || [],
            events: authclient.events || [],
            workshops: authclient.workshops || [],
          }}
        />
      )}
    </aside>
  );
}
