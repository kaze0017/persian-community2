'use client';

import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import FloorShapes from './subComponents/FloorShapes';
import PlacedTables from './subComponents/PlacedTables';
import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Konva from 'konva';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function cleanObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanObject(value);
      }
    }
    return cleaned;
  }
  return obj;
}

export default function PreviewCanvas() {
  const placedTables = useAppSelector((state) => state.tables.placedTables);
  const floor = useAppSelector((state) => state.tables.shapes);
  const stageRef = useRef<Konva.Stage>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const eventId = '0xek3FrR5b6bwjK2S0vf';

  const handleSaveLayout = async () => {
    if (!eventId) {
      setSaveError('No event ID provided');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const docRef = doc(db, 'events', eventId, 'layout', 'current');

      // Clean data before saving to avoid undefined fields
      const dataToSave = cleanObject({
        floor,
        placedTables,
        savedAt: new Date().toISOString(),
      });

      await setDoc(docRef, dataToSave);

      setIsSaving(false);
      alert('Layout saved successfully!');
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
    <div className='flex flex-col gap-4'>
      {/* Invisible / Offscreen Stage with WHITE bg and FLOOR */}
      <div className='absolute -z-50 opacity-0 pointer-events-none'>
        <Stage ref={stageRef} width={800} height={600}>
          <Layer>
            <Rect width={800} height={600} fill='white' />
            <FloorShapes floor={floor} />
            <PlacedTables
              tables={placedTables}
              selectedId={null}
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
          className='border'
        />
      )}

      <div className='flex gap-4'>
        <Button onClick={handleDownload}>Download as PNG</Button>
        <Button onClick={handleSaveLayout} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Layout'}
        </Button>
      </div>

      {saveError && <p className='text-red-600'>{saveError}</p>}
    </div>
  );
}
