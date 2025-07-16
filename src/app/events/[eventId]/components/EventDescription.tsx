import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import { updateDocument } from '@/services/firestoreService';

type Props = {
  description: string;
  isAdmin: boolean;
  eventId: string;
};

export default function EventDescription({
  description,
  isAdmin,
  eventId,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [localDescription, setLocalDescription] = useState(description);

  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const onSave = async (newDesc: string) => {
    try {
      await updateDocument('events', eventId, { description: newDesc });
      setLocalDescription(newDesc); // update local immediately
    } catch (err) {
      console.error('Failed to save description:', err);
    }
  };

  const handleSave = async () => {
    await onSave(localDescription.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalDescription(description);
    setEditing(false);
  };
  const content = (
    <>
      <AdminControlsPanel
        isAdmin={isAdmin}
        title='Event Description'
        updating={false}
        toggles={[]}
        uploads={[]}
        buttons={
          isAdmin && !editing
            ? [
                {
                  label: 'Edit Description',
                  onClick: () => setEditing(true),
                },
              ]
            : []
        }
      />
      <Card className='p-4'>
        <h2 className='text-xl font-semibold mb-2'>Event Description</h2>
        {editing ? (
          <>
            <textarea
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              rows={6}
              className='w-full p-2 border border-gray-300 rounded resize-y'
            />
            <div className='mt-2 flex space-x-2'>
              <button
                onClick={handleSave}
                className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className='text-muted-foreground whitespace-pre-wrap'>
            {localDescription}
          </p>
        )}
      </Card>
    </>
  );
  return isAdmin ? <SectionPanel> {content} </SectionPanel> : content;
}
