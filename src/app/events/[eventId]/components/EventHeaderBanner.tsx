'use client';

import Image from 'next/image';
import { Calendar, Edit2 } from 'lucide-react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '@/services/storageService';
import { updateDocument } from '@/services/firestoreService';

type Props = {
  title: string;
  date: string;
  bannerUrl?: string;
  eventId: string;
  isAdmin?: boolean;
};

export default function EventHeaderBanner({
  title,
  date,
  bannerUrl,
  eventId,
  isAdmin = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [currentBannerUrl, setCurrentBannerUrl] = useState(bannerUrl || '');

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDate, setLocalDate] = useState(date);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(file, `events/${eventId}/banner`);
      await updateDocument('events', eventId, { bannerUrl: url });
      setCurrentBannerUrl(url);
    } catch (err) {
      console.error('Error uploading Banner:', err);
    } finally {
      setUploading(false);
    }
  };

  const saveTitle = async () => {
    if (!localTitle.trim()) return;
    try {
      await updateDocument('events', eventId, { title: localTitle.trim() });
      setEditingTitle(false);
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };

  const saveDate = async () => {
    if (!localDate.trim()) return;
    try {
      await updateDocument('events', eventId, { date: localDate.trim() });
      setEditingDate(false);
    } catch (err) {
      console.error('Error updating date:', err);
    }
  };

  const headerContent = (
    <>
      {isAdmin && (
        <AdminControlsPanel
          isAdmin={isAdmin}
          title='Header Settings'
          updating={uploading}
          toggles={[]}
          uploads={[
            {
              label: 'Change Banner',
              inputRef: bannerInputRef,
              onChange: handleBannerChange,
            },
          ]}
          buttons={[]}
        />
      )}

      <div className='relative h-72 w-full overflow-hidden rounded-xl'>
        <Image
          src={currentBannerUrl || '/default-banner.jpg'}
          alt={localTitle}
          fill
          className='object-cover brightness-50'
          priority
        />
        <div className='absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4'>
          {/* Title */}
          <div className='flex items-center space-x-2'>
            {editingTitle ? (
              <>
                <input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className='bg-white text-black px-2 rounded'
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitle();
                    if (e.key === 'Escape') setEditingTitle(false);
                  }}
                />
                <button
                  className='bg-green-600 px-3 text-white rounded'
                  onClick={saveTitle}
                >
                  Save
                </button>
                <button
                  className='bg-gray-600 px-3 text-white rounded'
                  onClick={() => {
                    setLocalTitle(title);
                    setEditingTitle(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h1 className='text-4xl font-bold'>{localTitle}</h1>
                {isAdmin && (
                  <button
                    onClick={() => setEditingTitle(true)}
                    title='Edit title'
                    aria-label='Edit title'
                    className='p-1 rounded hover:bg-white/20'
                  >
                    <Edit2 className='w-5 h-5' />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Date */}
          <div className='flex items-center mt-2 space-x-2 text-lg'>
            <Calendar className='w-5 h-5' />
            {editingDate ? (
              <>
                <input
                  type='date'
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className='bg-white text-black px-2 rounded'
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveDate();
                    if (e.key === 'Escape') setEditingDate(false);
                  }}
                />
                <button
                  className='bg-green-600 px-3 text-white rounded'
                  onClick={saveDate}
                >
                  Save
                </button>
                <button
                  className='bg-gray-600 px-3 text-white rounded'
                  onClick={() => {
                    setLocalDate(date);
                    setEditingDate(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{localDate}</span>
                {isAdmin && (
                  <button
                    onClick={() => setEditingDate(true)}
                    title='Edit date'
                    aria-label='Edit date'
                    className='p-1 rounded hover:bg-white/20'
                  >
                    <Edit2 className='w-5 h-5' />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return isAdmin ? <SectionPanel>{headerContent}</SectionPanel> : headerContent;
}
