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

import ModeBtn from '@/components/btns/ModeBtn';
import AuthDropdown from '@/components/auth/AuthDropdown';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function HeaderGlass() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Businesses', href: '/businesses' },
    { label: 'Events', href: '/events' },
    { label: 'Workshops', href: '/workshops' },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className=' top-0 left-0 w-full flex items-center justify-between px-4 py-2 z-50'>
        <div
          className='w-full max-w-[1200px] mx-auto flex items-center justify-between
               rounded-xl px-4 py-2 '
        >
          {/* Left: Logo */}
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

          {/* Center: Desktop Nav */}
          <div className='hidden md:flex justify-center absolute left-1/2 -translate-x-1/2'>
            <NavigationMenu>
              <NavigationMenuList className='flex gap-4'>
                {navItems.map(({ label, href }) => (
                  <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={href}
                        className='w-[100px] flex items-center justify-center'
                      >
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Mode toggle and mobile menu */}
          <div className='flex items-center justify-end gap-2 md:w-1/3'>
            {/* <ModeBtn /> */}
            <AuthDropdown />

            {/* Mobile Menu */}
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
                    {navItems.map(({ label, href }) => (
                      <Button key={href} onClick={() => handleNavClick(href)}>
                        {label}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
