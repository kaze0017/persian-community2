import React, { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Person } from '@/types/person';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { fetchEvents } from '@/app/admin/events/reducer/eventsSlice';
import { fetchWorkshops } from '@/app/admin/workshops/workshopSlice';
import { fetchBusinesses } from '@/app/lib/businessesSlice';

interface ClientSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  user: Person;
}

export default function ClientSidebar({
  collapsed,
  setCollapsed,
  user,
}: ClientSidebarProps) {
  const [clientMenus] = React.useState([
    { label: 'Businesses', items: user.businesses ?? [] },
    { label: 'Workshops', items: user.workshops ?? [] },
    { label: 'Events', items: user.events ?? [] },
  ]);

  const allEvents = useAppSelector((state) => state.events.events);
  const allWorkshops = useAppSelector((state) => state.workshops.workshops);
  const allBusinesses = useAppSelector((state) => state.businesses.items);

  return (
    <nav className={cn(collapsed ? 'w-12 space-y-2' : 'w-64 p-4 space-y-2')}>
      {clientMenus.map((menu) => {
        // const subMenus = menu.items ?? [];

        // Collapsed sidebar: show initials
        if (collapsed) {
          return (
            <div
              key={menu.label}
              className='flex items-center justify-center'
              onClick={() => setCollapsed(false)}
            >
              <div className='w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold backdrop-blur-md bg-white/20 shadow-lg shadow-black/20 border border-white/30'>
                {menu.label[0]}
              </div>
            </div>
          );
        }

        // Expanded sidebar
        return (
          <Collapsible key={menu.label}>
            <CollapsibleTrigger className='flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-muted text-left'>
              <span>{menu.label}</span>
              <ChevronDown className='h-4 w-4 transition-transform data-[state=open]:rotate-180' />
            </CollapsibleTrigger>

            <CollapsibleContent className='pl-4 space-y-1 mt-1'>
              {menu.items.length > 0 ? (
                menu.items.map((sub) => (
                  <Link
                    key={sub}
                    href={sub}
                    className={cn(
                      'block px-3 py-1.5 rounded-md text-sm hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {menu.label === 'Businesses'
                      ? allBusinesses.find((b) => b.id === sub)?.businessName
                      : menu.label === 'Workshops'
                        ? allWorkshops.find((w) => w.id === sub)?.title
                        : allEvents.find((e) => e.id === sub)?.title}
                  </Link>
                ))
              ) : (
                <div className='px-3 py-1.5 text-sm text-muted-foreground'>
                  No {menu.label.toLowerCase()}
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
}
