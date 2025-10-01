import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TabTitle from '@/components/glassTabsComponent/TabTitle';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useAppDispatch } from '@/app/hooks';
import { updateUserEvent } from '../../clientEventsReducer';
import { Event } from '@/types/event';

type EventUiTabProps = {
  event: Event;
  clientId?: string;
};

export default function EventUiTab({ event, clientId }: EventUiTabProps) {
  const dispatch = useAppDispatch();

  const [sections, setSections] = useState({
    schedule: event.eventConfig?.scheduleConfig?.isEnabled ?? false,
    tickets: event.eventConfig?.ticketsConfig?.isEnabled ?? false,
    tags: event.eventConfig?.tagsConfig?.isEnabled ?? false,
    sponsors: event.eventConfig?.sponsorsConfig?.isEnabled ?? false,
    organizers: event.eventConfig?.organizersConfig?.isEnabled ?? false,
    layout: event.eventConfig?.layoutConfig?.isEnabled ?? false,
    contact: event.eventConfig?.contactConfig?.isEnabled ?? false,
  });

  const [dirty, setDirty] = useState(false);

  const toggleSection = (key: keyof typeof sections) => {
    setSections((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      setDirty(true);
      return newState;
    });
  };

  const saveSections = async () => {
    console.log(
      'Saving sections:',
      'eventId:',
      event.id,
      'clientId:',
      clientId
    );
    const updates: Partial<Event> = {
      eventConfig: {
        scheduleConfig: { isEnabled: sections.schedule },
        ticketsConfig: { isEnabled: sections.tickets },
        tagsConfig: { isEnabled: sections.tags },
        sponsorsConfig: { isEnabled: sections.sponsors },
        organizersConfig: { isEnabled: sections.organizers },
        layoutConfig: { isEnabled: sections.layout },
        contactConfig: { isEnabled: sections.contact },
      },
      clientId: clientId,
      id: event.id,
    };
    try {
      (console.log('Saving sections:', updates),
        await dispatch(
          updateUserEvent({
            clientId: event.clientId!,
            id: event.id!,
            updates,
          })
        ));
      setDirty(false);
    } catch (err) {
      console.error('Failed to save sections:', err);
    }
  };

  const sectionLabels: Record<keyof typeof sections, string> = {
    schedule: 'Schedule',
    tickets: 'Tickets',
    tags: 'Tags',
    sponsors: 'Sponsors',
    organizers: 'Organizers',
    layout: 'Layout',
    contact: 'Contact',
  };

  return (
    <>
      <TabTitle title='Event Sections' hasAddBtn={false} onAddType={() => {}} />

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

      <div className='mt-4 flex justify-end'>
        <Button
          variant='default'
          disabled={!dirty}
          onClick={saveSections}
          className='flex items-center gap-2'
        >
          <Save className='h-4 w-4' />
          Save Changes
        </Button>
      </div>

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
