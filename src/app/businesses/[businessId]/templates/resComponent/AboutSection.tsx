'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import { Business } from '@/types/business';

type Props = {
  businessId: string;
  isAdmin?: boolean;
  business: Business;
};

export default function AboutSection({
  businessId,
  isAdmin = false,
  business,
}: Props) {
  const initialDescription =
    business.businessConfig?.aboutConfig?.description || '';

  const [description, setDescription] = useState(initialDescription);
  const [editMode, setEditMode] = useState(false);
  const [tempText, setTempText] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  // Sync tempText if business prop changes
  useEffect(() => {
    setDescription(initialDescription);
    setTempText(initialDescription);
  }, [initialDescription]);

  const handleSave = async () => {
    setLoading(true);
    const docRef = doc(db, 'businesses', businessId);

    try {
      await updateDoc(docRef, {
        'businessConfig.aboutConfig.description': tempText,
      });
      setDescription(tempText);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update description:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionPanel>
      {editMode ? (
        <div className='space-y-2'>
          <Textarea
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
            rows={6}
            className='w-full'
          />
          <div className='flex gap-2'>
            <Button disabled={loading} onClick={handleSave}>
              Save
            </Button>
            <Button variant='outline' onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex justify-between items-start gap-4'>
          <p className='whitespace-pre-line flex-1'>
            {description || 'No description available.'}
          </p>
          {isAdmin && (
            <div className='shrink-0'>
              <Button
                size='sm'
                onClick={() => {
                  setTempText(description);
                  setEditMode(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      )}
    </SectionPanel>
  );
}
