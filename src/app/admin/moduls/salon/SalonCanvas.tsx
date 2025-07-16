// app/salon-editor/page.tsx
'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { useState } from 'react';

export default function SalonEditorPage() {
  const [shapes] = useState([
    {
      id: '1',
      type: 'rect',
      x: 40,
      y: 50,
      width: 120,
      height: 80,
      fill: '#3b82f6',
    },
    { id: '2', type: 'circle', x: 220, y: 100, radius: 40, fill: '#f43f5e' },
  ]);

  return (
    <div className='p-6 space-y-4'>
      <h2 className='text-2xl font-semibold'>Salon Layout Editor</h2>

      <Tabs defaultValue='stage' className='w-full'>
        <TabsList className='grid grid-cols-3 w-full'>
          <TabsTrigger value='stage'>Draw Stage</TabsTrigger>
          <TabsTrigger value='tables'>Add Tables</TabsTrigger>
          <TabsTrigger value='preview'>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value='stage'>
          <div className='border rounded-md p-2 mt-4 bg-white'>
            <Stage
              width={800}
              height={600}
              className='border shadow-md bg-gray-100'
            >
              <Layer>
                {shapes.map((shape) =>
                  shape.type === 'rect' ? (
                    <Rect key={shape.id} {...shape} />
                  ) : (
                    <Circle key={shape.id} {...shape} />
                  )
                )}
              </Layer>
            </Stage>
          </div>
        </TabsContent>

        <TabsContent value='tables'>
          <p className='text-gray-500 mt-4'>Table adding tools will go here.</p>
        </TabsContent>

        <TabsContent value='preview'>
          <p className='text-gray-500 mt-4'>Preview/export will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
