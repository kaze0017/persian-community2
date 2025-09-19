import React, { useState } from 'react';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';
import { TabsContent } from '@/components/ui/tabs';
import TabTitle from '../../../../components/glassTabsComponent/TabTitle';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UiTab() {
  const [sections, setSections] = useState({
    products: true,
    services: true,
    googleReviews: true,
    contact: true,
  });

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddService = () => {
    // Logic to handle adding a new service
  };

  const sectionLabels: Record<keyof typeof sections, string> = {
    products: 'Products',
    services: 'Services',
    googleReviews: 'Google Reviews',
    contact: 'Contact',
  };

  return (
    <>
      <TabTitle
        title='Available Sections'
        hasAddBtn={false}
        onAddType={handleAddService}
      />

      {/* Toggle list */}
      <div className='mt-4 space-y-3'>
        {Object.keys(sections).map((key) => {
          const typedKey = key as keyof typeof sections;
          return (
            <div
              key={typedKey}
              className='flex items-center justify-between rounded-xl border p-3 shadow-sm'
            >
              <span className='text-lg font-medium'>
                {sectionLabels[typedKey]}
              </span>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => toggleSection(typedKey)}
              >
                {sections[typedKey] ? (
                  <Eye className='h-5 w-5 text-green-600' />
                ) : (
                  <EyeOff className='h-5 w-5 text-gray-400' />
                )}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Live Preview */}
      <div className='mt-6 border-t pt-4'>
        <h3 className='text-base font-semibold mb-2'>Live Preview</h3>
        <div className='space-y-2 text-sm'>
          {Object.entries(sections).map(([key, enabled]) =>
            enabled ? (
              <div key={key}>
                ✅ {sectionLabels[key as keyof typeof sections]} Section
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
}
