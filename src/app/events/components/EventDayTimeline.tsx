'use client';

import { useState } from 'react';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import { CalendarClock, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventDay } from '@/types/event';
import { ICONS } from '@/app/admin/events/add-event/components/IconPicker';
import { EventBlock } from '@/types/event'; // if defined

type Props = {
  day: EventDay;
};

export default function EventDayTimeline({ day }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const renderIcon = (iconName?: string) => {
    if (iconName && iconName in ICONS) {
      const Icon = ICONS[iconName as keyof typeof ICONS];
      return <Icon className='text-white w-5 h-5' />;
    }
    return <Users className='text-white w-5 h-5' />;
  };
  const getActivities = (block: EventBlock): string[] => {
    if (Array.isArray(block.activities)) return block.activities;
    if (typeof block.activities === 'string')
      return block.activities.split(',');
    return [];
  };

  return (
    <Card className='mb-6'>
      <CardHeader>
        <Button
          variant='ghost'
          onClick={toggleExpanded}
          className='w-full justify-between text-left px-0'
        >
          <span className='flex items-center gap-2 font-semibold text-lg'>
            <CalendarClock className='w-5 h-5' /> {day.date}
          </span>
          {expanded ? (
            <ChevronDown className='w-4 h-4' />
          ) : (
            <ChevronRight className='w-4 h-4' />
          )}
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent>
          <VerticalTimeline lineColor='#e5e7eb'>
            {day.blocks.map((block, index) => (
              <VerticalTimelineElement
                key={index}
                contentArrowStyle={{ borderRight: '7px solid #e5e7eb' }}
                date={`${block.start} - ${block.end}`}
                icon={renderIcon(block.iconName)}
                iconStyle={{ background: '#3b82f6', color: '#fff' }}
              >
                <h3 className='text-lg font-bold text-red-600 dark:font-light'>
                  {block.title}
                </h3>
                <ul className='mt-2 list-disc list-inside text-sm text-gray-600'>
                  {getActivities(block).map((act, i) => (
                    <li key={i}>{act.trim()}</li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </CardContent>
      )}
    </Card>
  );
}
