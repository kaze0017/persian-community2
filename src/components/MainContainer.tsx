'use client';
import React from 'react';
import { Card } from './ui/card';
import { useMediaQuery } from '@/app/utils/useMediaQuery';

export default function MainContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const containerClass = isLargeScreen
    ? 'max-w-6xl mx-auto px-4 py-6 flex flex-col grow w-full'
    : 'w-full px-2 py-4 flex flex-col grow';
  return <Card className={containerClass}>{children}</Card>;
}
