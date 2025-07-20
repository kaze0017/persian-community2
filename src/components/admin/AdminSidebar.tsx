'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard' },
  // { href: '/admin/add-business', label: 'Add Business' },
  { href: '/admin/show-businesses', label: 'Businesses' },
  { href: '/admin/events', label: 'Events' },
  // { href: '/admin/events/add-event', label: 'Add event' },

  { href: '/admin/categories', label: 'Categories' },
  {
    href: '/admin/occasions',
    label: 'Occasions',
  },
  { href: '/admin/manage-users', label: 'Manage Users' },
  { href: '/admin/products', label: 'My Products' },

  { href: '/admin/workshops', label: 'Workshops' },
  { href: '/admin/people', label: 'People' },
  // { href: '/admin/help', label: 'Help' },
  // { href: '/admin/help', label: 'Help' },
  // { href: '/admin/help', label: 'Help' },
  // { href: '/admin/help', label: 'Help' },
  // { href: '/admin/help', label: 'Help' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        'h-screen border-r bg-background transition-all duration-300 ease-in-out',
        collapsed ? 'w-16 p-2' : 'w-64 p-4'
      )}
    >
      <div className='flex items-center justify-between mb-4'>
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

      <nav className='flex flex-col gap-2'>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              pathname === href && 'bg-accent text-accent-foreground'
            )}
          >
            {collapsed ? (
              <span className='block w-full text-center'>{label[0]}</span>
            ) : (
              label
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
