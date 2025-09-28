'use client';

import { useState } from 'react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Event } from '@/types/event';
import BusinessSelect from '@/components/BusinessSelector';
import TagSelector from '@/components/TagSelector';
import OrganizerEditor from '@/components/OrganizerEditor';

import { useForm, FormProvider } from 'react-hook-form';
import { updateDocument } from '@/services/firestoreService';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';

type Props = Pick<Event, 'tags' | 'sponsors' | 'organizers'> & {
  eventId: string;
  isAdmin: boolean;
};

type FormData = {
  organizers: Event['organizers'];
};

export default function EventTagsSponsorsOrganizers({
  tags,
  sponsors,
  organizers,
  eventId,
  isAdmin,
}: Props) {
  const [editing, setEditing] = useState(false);

  const [selectedTags, setSelectedTags] = useState(tags ?? []);
  const [selectedSponsors, setSelectedSponsors] = useState(sponsors ?? []);

  const methods = useForm<FormData>({
    defaultValues: {
      organizers: organizers ?? [],
    },
  });

  const currentOrganizers = methods.watch('organizers') ?? [];

  async function handleToggleEditing() {
    if (editing) {
      const updatedOrganizers = methods.getValues('organizers');
      try {
        await updateDocument('events', eventId, {
          tags: selectedTags,
          sponsors: selectedSponsors,
          organizers: updatedOrganizers,
        });
      } catch (err) {
        console.error('Failed to update event:', err);
      }
    }
    setEditing((prev) => !prev);
  }

  return (
    <FormProvider {...methods}>
      {isAdmin ? (
        // <GlassPanel>
        //   <AdminControlsPanel
        //     isAdmin
        //     title='Tags, Sponsors & Organizers'
        //     updating={false}
        //     toggles={[]}
        //     uploads={[]}
        //     buttons={[
        //       {
        //         label: editing ? 'Done Editing Fields' : 'Edit Fields',
        //         onClick: handleToggleEditing,
        //       },
        //     ]}
        //   />

        //   <div className='p-4 space-y-2'>
        //     {/* Tags */}
        //     <h3 className='font-semibold'>Tags</h3>
        //     {editing ? (
        //       <TagSelector value={selectedTags} onChange={setSelectedTags} />
        //     ) : (
        //       <div className='flex gap-2 flex-wrap'>
        //         {selectedTags.map((tag) => (
        //           <Badge key={tag} variant='outline'>
        //             {tag}
        //           </Badge>
        //         ))}
        //       </div>
        //     )}

        //     {/* Sponsors */}
        //     <h3 className='font-semibold mt-4'>Sponsors</h3>
        //     {editing ? (
        //       <BusinessSelect
        //         value={selectedSponsors}
        //         onChange={setSelectedSponsors}
        //       />
        //     ) : (
        //       <div className='flex flex-wrap gap-2'>
        //         {selectedSponsors.map((sponsor) => (
        //           <Badge
        //             key={sponsor.id}
        //             className='flex items-center gap-2 px-3 py-1'
        //           >
        //             {sponsor.ownerImageUrl && (
        //               <div className='relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm'>
        //                 <Image
        //                   src={sponsor.ownerImageUrl}
        //                   alt={`${sponsor.businessName} owner`}
        //                   width={24}
        //                   height={24}
        //                   className='object-cover rounded-full'
        //                 />
        //               </div>
        //             )}
        //             <span>{sponsor.businessName}</span>
        //           </Badge>
        //         ))}
        //       </div>
        //     )}

        //     {/* Organizers */}
        //     <h3 className='font-semibold mt-4'>Organizers</h3>
        //     {editing ? (
        //       <OrganizerEditor />
        //     ) : (
        //       <ul className='list-disc list-inside text-muted-foreground'>
        //         {currentOrganizers.map((org, index) => (
        //           <li key={org.id ?? index}>
        //             {org.name} {org.contact ? `(${org.contact})` : ''}
        //           </li>
        //         ))}
        //       </ul>
        //     )}
        //   </div>
        // </GlassPanel>
        <> </>
      ) : (
        // If NOT admin, just render the Card without SectionPanel & AdminControlsPanel
        <GlassPanel>
          {/* Tags */}
          <h3 className='font-semibold'>Tags</h3>
          <div className='flex gap-2 flex-wrap'>
            {selectedTags.map((tag) => (
              <Badge key={tag} variant='outline'>
                {tag}
              </Badge>
            ))}
          </div>

          {/* Sponsors */}
          <h3 className='font-semibold mt-4'>Sponsors</h3>
          <div className='flex flex-wrap gap-2'>
            {selectedSponsors.map((sponsor) => (
              <Badge
                key={sponsor.id}
                className='flex items-center gap-2 px-3 py-1'
              >
                {sponsor.ownerImageUrl && (
                  <div className='relative w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                    <Image
                      src={sponsor.ownerImageUrl}
                      alt={`${sponsor.businessName} owner`}
                      width={24}
                      height={24}
                      className='object-cover rounded-full'
                    />
                  </div>
                )}
                <span>{sponsor.businessName}</span>
              </Badge>
            ))}
          </div>

          {/* Organizers */}
          <h3 className='font-semibold mt-4'>Organizers</h3>
          <ul className='list-disc list-inside text-muted-foreground'>
            {currentOrganizers.map((org, index) => (
              <li key={org.id ?? index}>
                {org.name} {org.contact ? `(${org.contact})` : ''}
              </li>
            ))}
          </ul>
        </GlassPanel>
      )}
    </FormProvider>
  );
}
