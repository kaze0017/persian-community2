import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

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
interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
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
  );
}
