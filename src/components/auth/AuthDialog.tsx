'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReactNode, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  signup,
  loginWithGoogle,
  clearError,
} from '@/components/auth/userSlice';
import { RootState, AppDispatch } from '@/app/lib/store';

// Define useAppDispatch outside the component
const useAppDispatch = () => useDispatch<AppDispatch>();

interface AuthDialogProps {
  trigger: ReactNode;
}

export default function AuthDialog({ trigger }: AuthDialogProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Select loading and error from Redux state
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  // Reset error on tab change or input change
  useEffect(() => {
    dispatch(clearError());
  }, [tab, email, password, dispatch]);

  const handleAuth = () => {
    if (tab === 'login') {
      dispatch(login({ email, password }));
    } else {
      dispatch(signup({ email, password }));
    }
  };

  const handleGoogle = () => {
    dispatch(loginWithGoogle());
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{tab === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(val) => setTab(val as 'login' | 'signup')}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2 mb-4'>
            <TabsTrigger value='login'>Login</TabsTrigger>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value='login'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
              className='space-y-4'
            >
              <Input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              {error && <p className='text-red-500 text-sm'>{error}</p>}
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <Button
              variant='outline'
              onClick={handleGoogle}
              className='mt-4 w-full'
              disabled={loading}
            >
              Continue with Google
            </Button>
          </TabsContent>

          <TabsContent value='signup'>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
              }}
              className='space-y-4'
            >
              <Input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              {error && <p className='text-red-500 text-sm'>{error}</p>}
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
            <Button
              variant='outline'
              onClick={handleGoogle}
              className='mt-4 w-full'
              disabled={loading}
            >
              Continue with Google
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
