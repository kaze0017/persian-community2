'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { updateUserTheme } from '@/app/utils/firestoreUser';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setThemeMode } from '@/components/auth/userSlice';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ModeToggle() {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const uid = user?.uid;

  // Set theme from Redux on mount
  React.useEffect(() => {
    if (user.themeMode) {
      setTheme(user.themeMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.themeMode]);

  const handleChangeTheme = async (theme: 'light' | 'dark' | 'system') => {
    dispatch(setThemeMode(theme));
    if (uid) {
      try {
        await updateUserTheme(uid, theme);
      } catch (error) {
        console.error('Failed to update theme in Firestore:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => handleChangeTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChangeTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
