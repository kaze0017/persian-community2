'use client';

import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import FloorShapes from './subComponents/FloorShapes';
import PlacedTables from './subComponents/PlacedTables';
import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Konva from 'konva';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage } from '@/services/storageService';

function cleanObject<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject) as T;
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanObject(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export default function PreviewCanvas({
  clientId,
  eventId,
}: {
  clientId?: string;
  eventId?: string;
}) {
  const placedTables = useAppSelector((state) => state.tables.placedTables);
  const floor = useAppSelector((state) => state.tables.shapes);
  const stageRef = useRef<Konva.Stage>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const eventIdLocal = eventId || '0xek3FrR5b6bwjK2S0vf';

  function dataURLtoFile(dataurl: string, filename: string) {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleSaveLayout = async () => {
    if (!clientId) {
      setSaveError('No user ID provided');
      return;
    }
    if (!eventIdLocal) {
      setSaveError('No event ID provided');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // 1️⃣ Save layout JSON
      const docRef = doc(
        db,
        'users',
        clientId,
        'events',
        eventIdLocal,
        'layout',
        'current'
      );

      const dataToSave = cleanObject({
        floor,
        placedTables,
        savedAt: new Date().toISOString(),
      });

      await setDoc(docRef, dataToSave);

      // 2️⃣ Convert dataURL to File and upload
      if (imageUrl) {
        const file = dataURLtoFile(imageUrl, 'layout.png');
        const url = await uploadImage(
          file,
          `clients/${clientId}/events/${eventIdLocal}`
        );

        console.log('Uploaded layout image URL:', url);

        // 3️⃣ Save the URL in parent event doc
        const eventDocRef = doc(db, 'users', clientId, 'events', eventIdLocal);
        await updateDoc(eventDocRef, {
          eventLayoutUrl: url,
        });
      }

      setIsSaving(false);
      alert('Layout and preview saved successfully!');
    } catch (error) {
      setIsSaving(false);
      setSaveError('Failed to save layout: ' + (error as Error).message);
    }
  };

  const exportToImage = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({
      mimeType: 'image/png',
      pixelRatio: 2,
    });
    setImageUrl(dataURL);
  };

  useEffect(() => {
    exportToImage();
  }, [placedTables, floor]);

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = 'tables-layout.png';
    link.href = imageUrl;
    link.click();
  };

  return (
    <div
      className='relative p-6 rounded-2xl shadow-lg
                 bg-white/10 backdrop-blur-md border border-white/20
                 flex flex-col gap-4 max-w-4xl mx-auto'
    >
      {/* Invisible / Offscreen Stage with WHITE bg and FLOOR */}
      <div className='absolute -z-50 opacity-0 pointer-events-none'>
        <Stage ref={stageRef} width={800} height={600}>
          <Layer>
            <Rect width={800} height={600} fill='white' />
            <FloorShapes floor={floor} />
            <PlacedTables
              tables={placedTables}
              onSelect={() => {}}
              onDragEnd={() => {}}
            />
          </Layer>
        </Stage>
      </div>

      {/* Only show the rendered result */}
      {imageUrl && (
        <Image
          src={imageUrl}
          width={800}
          height={600}
          alt='Salon Preview'
          className='rounded-xl border border-white/30 shadow-md'
        />
      )}

      <div className='flex gap-4'>
        <Button onClick={handleDownload} className='rounded-xl'>
          Download as PNG
        </Button>
        <Button
          onClick={handleSaveLayout}
          disabled={isSaving}
          className='rounded-xl'
        >
          {isSaving ? 'Saving...' : 'Save Layout'}
        </Button>
      </div>

      {saveError && <p className='text-red-500'>{saveError}</p>}
    </div>
  );
}
