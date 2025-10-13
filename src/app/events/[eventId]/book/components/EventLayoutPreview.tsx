'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import FloorShapes from '@/app/admin/salon/subComponents/FloorShapes';
import PlacedTables from '@/app/admin/salon//subComponents/PlacedTables';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Konva from 'konva';
import { Floor, Table } from '@/app/admin/salon/types';

interface EventLayoutPreviewProps {
  eventId: string;
}

export default function EventLayoutPreview({
  eventId,
}: EventLayoutPreviewProps) {
  const [floor, setFloor] = useState<Floor>([]);
  const [placedTables, setPlacedTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {
    async function fetchLayout() {
      if (!eventId) return;
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'events', eventId, 'layout', 'current');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFloor(data.floor ?? []);
          setPlacedTables(data.placedTables ?? []);
        } else {
          setFloor([]);
          setPlacedTables([]);
        }
      } catch {
        setError('Failed to load layout data.');
        setFloor([]);
        setPlacedTables([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLayout();
  }, [eventId]);

  const exportImage = () => {
    if (!stageRef.current) return;
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    setImageUrl(url);
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.download = 'event-layout.png';
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className='space-y-8'>
      {/* First Row: Description */}
      <Card>
        <CardHeader>
          <CardTitle>About the Layout</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-muted-foreground text-sm'>
          <p>
            This is the seating and stage arrangement for this event. Tables and
            floor shapes reflect the venue’s setup.
          </p>
          <p>
            Organizers can visually verify the flow, seating density, and stage
            orientation.
          </p>
          <p>Layout is static for attendees and editable by admins only.</p>
        </CardContent>
      </Card>

      {/* Second Row: Layout Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Event Layout Preview</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col items-center space-y-4'>
          {loading && (
            <p className='text-muted-foreground text-sm'>Loading layout...</p>
          )}
          {error && <p className='text-sm text-red-500'>{error}</p>}

          {!loading && !error && floor.length === 0 && (
            <p className='text-muted-foreground text-sm'>
              No layout data available for this event.
            </p>
          )}

          {!loading && !error && floor.length > 0 && (
            <>
              <Stage
                ref={stageRef}
                width={800}
                height={600}
                className='bg-white border'
              >
                <Layer>
                  <Rect width={800} height={600} fill='white' />
                  <FloorShapes floor={floor} />
                  <PlacedTables
                    tables={placedTables}
                    // selectedId={null}
                    onSelect={() => {}}
                    onDragEnd={() => {}}
                  />
                </Layer>
              </Stage>

              <Button
                onClick={() => {
                  exportImage();
                  setTimeout(() => handleDownload(), 100); // ensure imageUrl updated
                }}
              >
                Download as PNG
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
