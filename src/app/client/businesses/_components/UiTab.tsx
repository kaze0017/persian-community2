import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TabTitle from '../../../../components/glassTabsComponent/TabTitle';
import { Eye, EyeOff } from 'lucide-react';
import {
  setAboutEnabled,
  setServicesEnabled,
  setGoogleReviewsEnabled,
  setContactEnabled,
} from '@/services/business/uiApi';
import { useAppSelector } from '@/app/hooks';

type UiTabProps = {
  businessId: string;
  initialSections?: {
    about?: boolean;
    services?: boolean;
    googleReviews?: boolean;
    contact?: boolean;
  };
};

export default function UiTab({ businessId, initialSections }: UiTabProps) {
  const selectedBusiness = useAppSelector(
    (state) => state.clientBusiness.selectedBusiness
  );
  const [sections, setSections] = useState({
    about: selectedBusiness?.businessConfig?.aboutConfig?.isEnabled ?? false,
    services:
      selectedBusiness?.businessConfig?.servicesConfig?.isEnabled ?? false,
    googleReviews:
      selectedBusiness?.businessConfig?.googleReviewsConfig?.isEnabled ?? false,
    contact:
      selectedBusiness?.businessConfig?.contactConfig?.isEnabled ?? false,
  });

  const toggleSection = async (key: keyof typeof sections) => {
    const newValue = !sections[key];

    // Update UI state immediately
    setSections((prev) => ({ ...prev, [key]: newValue }));

    // Sync with Firestore
    try {
      switch (key) {
        case 'about':
          await setAboutEnabled(businessId, newValue);
          break;
        case 'services':
          await setServicesEnabled(businessId, newValue);
          break;
        case 'googleReviews':
          await setGoogleReviewsEnabled(businessId, newValue);
          break;
        case 'contact':
          await setContactEnabled(businessId, newValue);
          break;
      }
    } catch (error) {
      console.error('Failed to update section in Firestore:', error);
      // Revert UI state on error
      setSections((prev) => ({ ...prev, [key]: !newValue }));
    }
  };

  const sectionLabels: Record<keyof typeof sections, string> = {
    about: 'About',
    services: 'Services',
    googleReviews: 'Google Reviews',
    contact: 'Contact',
  };

  return (
    <>
      <TabTitle
        title='Available Sections'
        hasAddBtn={false}
        onAddType={() => {}}
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
