'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpenCheck,
  Palette,
  Briefcase,
  HeartPulse,
  Music3,
  Construction,
} from 'lucide-react';

export default function WorkshopsPage() {
  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      <h1 className='text-3xl font-bold'>Workshops & Courses</h1>
      <p className='text-muted-foreground'>
        This page will showcase a variety of courses, workshops, and training
        opportunities offered by our Persian community in Ottawa.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Construction className='h-5 w-5 text-yellow-500' /> Under
            Construction
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6 text-muted-foreground'>
          <p className='text-base'>
            We are preparing a directory of educational opportunities tailored
            for our community, including:
          </p>

          <ul className='space-y-4'>
            <li className='flex items-center gap-3'>
              <BookOpenCheck className='h-5 w-5 text-primary' />
              <span>Persian language classes for children and adults</span>
            </li>
            <li className='flex items-center gap-3'>
              <Palette className='h-5 w-5 text-pink-500' />
              <span>Art, dance, and cultural workshops</span>
            </li>
            <li className='flex items-center gap-3'>
              <Briefcase className='h-5 w-5 text-blue-500' />
              <span>Professional development & career training</span>
            </li>
            <li className='flex items-center gap-3'>
              <HeartPulse className='h-5 w-5 text-rose-500' />
              <span>Community wellness and mental health programs</span>
            </li>
            <li className='flex items-center gap-3'>
              <Music3 className='h-5 w-5 text-violet-500' />
              <span>Seasonal events like music and poetry workshops</span>
            </li>
          </ul>

          <p className='text-sm text-muted-foreground'>
            📅 Stay tuned — this page is actively being developed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
