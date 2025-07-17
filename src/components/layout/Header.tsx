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

export default function Header() {
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
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='w-[300px] p-4 space-y-2'>
                  <ListItem href='/' title='Welcome'>
                    Intro content here
                  </ListItem>
                  <ListItem href='/docs' title='Docs'>
                    Documentation
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}

            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-2 md:grid-cols-2 p-4'>
                  {[
                    { title: 'Tabs', href: '/tabs' },
                    { title: 'Progress', href: '/progress' },
                  ].map((item) => (
                    <ListItem key={item.title} {...item}>
                      Description for {item.title}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}

            <NavigationMenuItem>
              <NavigationMenuLink
                href='/'
                className={navigationMenuTriggerStyle()}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href='/businesses'
                className={navigationMenuTriggerStyle()}
              >
                Businesses
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href='/events'
                className={navigationMenuTriggerStyle()}
              >
                Events
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href='/workshops'
                className={navigationMenuTriggerStyle()}
              >
                Workshops
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* ✅ Right: Mode toggle (and mobile menu) */}
      <div className='flex items-center justify-end gap-2 md:w-1/3'>
        <ModeBtn />
        <AuthDropdown />

        {/* Desktop Menu */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='p-4'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                {/* optional: <SheetDescription>Navigation links</SheetDescription> */}
              </SheetHeader>
              <nav className='flex flex-col gap-4'>
                <Link href='/'>Home</Link>
                <Link href='/'>Businesses</Link>
                <Link href='/'>Events</Link>
                {/* <Link href='/docs'>Docs</Link> */}
                {/* <Link href='/components'>Components</Link> */}
                {/* <Link href='/themes'>Themes</Link> */}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// function ListItem({
//   title,
//   children,
//   href,
// }: {
//   title: string;
//   children: React.ReactNode;
//   href: string;
// }) {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <Link href={href} className='block text-sm font-medium'>
//           <div>{title}</div>
//           <p className='text-xs text-muted-foreground'>{children}</p>
//         </Link>
//       </NavigationMenuLink>
//     </li>
//   );
// }
