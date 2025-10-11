import React, { useCallback, useRef } from 'react';
import GlassPanel from '@/components/glassTabsComponent/GlassPanel';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { Button } from '@/components/ui/button';
import { MarkerData } from '@/types/event';
import { Editor } from '@tiptap/react';

interface TiptapEditorProps {
  marker: MarkerData;
  eventId: string;
  pinId?: string;
  handleUpdateMarker: (markerId: string, updates: Partial<MarkerData>) => void;
}

export default function TiptapEditor({
  marker,

  handleUpdateMarker,
  eventId,
  pinId,
}: TiptapEditorProps) {
  const editorRef = useRef<Editor | null>(null);

  const handleSave = useCallback(() => {
    if (!editorRef.current) return;
    const content = editorRef.current.getJSON();
    handleUpdateMarker(marker.id, {
      description: JSON.stringify(content),
      title:
        editorRef.current.getText().split('\n')[0] ||
        marker.title ||
        'Untitled',
    });
    // Close the dialog after saving
    setTimeout(() => {
      const dialog = document
        .querySelector('[data-state="open"]')
        ?.closest('dialog');
      dialog?.close();
    }, 0);
  }, [marker.id, marker.title, handleUpdateMarker]);

  const handleCancel = useCallback(() => {
    // Close the dialog without saving
    const dialog = document
      .querySelector('[data-state="open"]')
      ?.closest('dialog');
    dialog?.close();
  }, []);

  return (
    <div className='w-full flex flex-col h-full p-4'>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex gap-2'>
          <Button
            onClick={handleCancel}
            variant='outline'
            className='border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className='bg-grok-teal-600 hover:bg-grok-teal-700 text-white'
          >
            Save
          </Button>
        </div>
        {/* <Button
          onClick={handleCancel}
          variant='ghost'
          className='p-1 text-gray-600 dark:text-gray-300 h-8 w-8'
          size='sm'
        >
          <X className='h-4 w-4' />
        </Button> */}
      </div>
      <SimpleEditor
        eventId={marker.eventId}
        pinId={marker.id}
        className='w-full prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert min-h-[300px]'
        onUpdate={({ editor }) => {
          editorRef.current = editor;
        }}
        content={
          marker.description ? JSON.parse(marker.description) : undefined
        }
      />
    </div>
  );
}
