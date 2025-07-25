'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// 👇 import your dark mode button
import ModeBtn from '@/components/btns/ModeBtn';
import AuthDropdown from '@/components/auth/AuthDropdown';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };
  function cn(
    arg0: string,
    arg1: string,
    arg2: string | boolean
  ): string | undefined {
    throw new Error('Function not implemented.');
  }

  return (
    <header className='relative flex items-center justify-between px-4 py-2 border-b bg-background'>
      {/* ✅ Left: Logo */}
      <div className='flex items-center md:w-1/3 max-h-[80px]'>
        <Link href='/' className='text-xl font-bold text-primary'>
          <Image
            src='/icon-192x192.png'
            alt='My Persian App Logo'
            width={80}
            height={80}
            className='mr-2 rounded-full'
          />
        </Link>
      </div>

      {/* ✅ Center: Desktop Nav */}
      <div className='hidden md:flex justify-center absolute left-1/2 -translate-x-1/2'>
        <NavigationMenu>
          <NavigationMenuList className='flex gap-4'>
            {[
              { label: 'Home', href: '/' },
              { label: 'Businesses', href: '/businesses' },
              { label: 'Events', href: '/events' },
              { label: 'Workshops', href: '/workshops' },
            ].map(({ label, href }) => (
              <NavigationMenuItem key={href}>
                <Link href={href}>
                  <NavigationMenuLink
                    className={'width-[120px] ' + navigationMenuTriggerStyle()}
                  >
                    {label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* ✅ Right: Mode toggle (and mobile menu) */}
      <div className='flex items-center justify-end gap-2 md:w-1/3'>
        <ModeBtn />
        <AuthDropdown />

        {/* Desktop Menu */}
        <div className='md:hidden'>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-4'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4'>
                <Button onClick={() => handleNavClick('/')}>Home</Button>
                <Button onClick={() => handleNavClick('/businesses')}>
                  Businesses
                </Button>
                <Button onClick={() => handleNavClick('/events')}>
                  Events
                </Button>
                <Button onClick={() => handleNavClick('/workshops')}>
                  Workshops
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
