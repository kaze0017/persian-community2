'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import GlassPanel from './GlassPanel';
import TabTitle from './TabTitle';

type GlassTabsProps = {
  defaultValue: string;
  tabs: {
    value: string;
    label: string;
    icon?: LucideIcon;
    panel: React.ReactNode;
  }[];
};

export default function GlassTabs({ defaultValue, tabs }: GlassTabsProps) {
  return (
    <div className='w-full max-w-6xl mx-auto p-4 md:p-6'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='relative'
      >
        <div className='rounded-2xl p-4 md:p-6 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl'>
          <Tabs defaultValue={defaultValue} className='w-full'>
            {/* Tab headers */}
            <div className='w-full'>
              <TabsList className='flex flex-wrap items-center gap-1.5 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-1 shadow-sm'>
                {tabs.map(({ value, label, icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className='data-[state=active]:bg-white/30 data-[state=active]:text-black dark:data-[state=active]:text-white rounded-xl flex-1 min-w-[80px]'
                  >
                    {icon && (
                      <span className='mr-2 h-4 w-4'>
                        {React.createElement(icon)}
                      </span>
                    )}
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab panels */}
            <div className='mt-4 md:mt-6 grid grid-cols-1'>
              {tabs.map(({ value, panel }) => (
                <TabsContent key={value} value={value}>
                  <GlassPanel>{panel}</GlassPanel>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
