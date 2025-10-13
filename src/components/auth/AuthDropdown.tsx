'use client';

import { LogIn } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import AuthDialog from '@/components/auth/AuthDialog';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { logout } from '@/components/auth/userSlice'; // Add this import
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

export default function UserAuthMenu() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const isLoggedIn = useMemo(() => {
    return user.uid !== null && user.email !== null;
  }, [user]);

  if (!isLoggedIn) {
    // Show Badge that triggers the existing AuthDialog modal
    return (
      <AuthDialog
        trigger={
          <Button variant='outline' size='icon'>
            <LogIn className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all' />
          </Button>
        }
      />
    );
  }

  // Logged in: avatar + dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer'>
          <AvatarImage
            src={user.photoURL || '/default-avatar.png'}
            alt={user.displayName || 'User avatar'}
          />
          <AvatarFallback>
            {(user.displayName?.[0] || 'U').toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem>
          <Link href='/client' className='w-full'>
            Client Panel
          </Link>{' '}
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem>
            <Link href='/admin' className='w-full'>
              Admin Panel
            </Link>{' '}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => alert('Go to Favorites')}>
          Favorites
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Customize')}>
          Customization
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => alert('Settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            toast('Logged out successfully', {
              description: 'You have been logged out.',
            });
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
