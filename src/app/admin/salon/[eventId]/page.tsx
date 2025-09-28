// app/salon-editor/page.tsx
'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TablesCanvas from './TablesCanvas';
import SetStage from './SetStage';
import PreviewCanvas from './PreviewCanvas';
import { useAppDispatch } from '@/app/hooks';
import { setShapes, setPlacedTables, setTables } from '../salonSlice';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
// Dynamically load React-Konva part without SSR
const StageCanvas = dynamic(() => import('./StageCanvas'), {
  ssr: false,
});
import { useParams } from 'next/navigation';

export default function SalonEditorPage({
  eventId,
  clientId,
}: {
  eventId?: string;
  clientId?: string;
}) {
  const params = useParams();
  // const eventId = params.eventId as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!eventId || !clientId) return;

    const fetchLayout = async () => {
      try {
        const docRef = doc(
          db,
          'users',
          clientId,
          'events',
          eventId,
          'layout',
          'current'
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Safely extract with defaults
          const floor = Array.isArray(data?.floor) ? data.floor : [];
          const placedTables = Array.isArray(data?.placedTables)
            ? data.placedTables
            : [];

          // Dispatch into Redux
          dispatch(setShapes(floor));
          dispatch(setPlacedTables(placedTables));
          dispatch(setTables(placedTables)); // ✅ only if your tables slice should mirror placedTables
        } else {
          console.log('ℹ️ No saved layout found for this event.');
        }
      } catch (error) {
        console.error('❌ Error fetching layout:', error);
      }
    };

    fetchLayout();
  }, [dispatch, eventId, clientId]);

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-semibold'>Salon Layout Editor</h2>

      <Tabs defaultValue='stage' className='w-full'>
        <TabsList className='grid grid-cols-4 w-full'>
          <TabsTrigger value='stage'>Stage</TabsTrigger>
          <TabsTrigger value='tables'>Tables and Seats</TabsTrigger>
          <TabsTrigger value='setTheStage'>Set The Stage</TabsTrigger>
          <TabsTrigger value='preview'>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value='stage'>
          <StageCanvas />
        </TabsContent>

        <TabsContent value='tables'>
          <TablesCanvas />
        </TabsContent>
        <TabsContent value='setTheStage'>
          <SetStage />
        </TabsContent>

        <TabsContent value='preview'>
          <PreviewCanvas clientId={clientId} eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
