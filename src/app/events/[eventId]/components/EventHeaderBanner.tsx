'use client';

import { getImageProps } from 'next/image';
import { Calendar, Edit2 } from 'lucide-react';
import SectionPanel from '@/app/businesses/components/subComponents/SectionPanel';
import AdminControlsPanel from '@/app/businesses/components/subComponents/AdminControlsPanel';
import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '@/services/storageService';
import { updateDocument } from '@/services/firestoreService';
import { Banner } from '@/types/banner';

type Props = {
  title: string;
  date: string;
  bannerUrls?: Banner;
  eventId: string;
  isAdmin?: boolean;
};

export default function EventHeaderBanner({
  title,
  date,
  bannerUrls,
  eventId,
  isAdmin = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [currentBanner, setCurrentBanner] = useState<Banner | undefined>(
    bannerUrls
  );

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localDate, setLocalDate] = useState(date);

  useEffect(() => setLocalTitle(title), [title]);
  useEffect(() => setLocalDate(date), [date]);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const url = await uploadImage(
        file,
        `events/${eventId}/banner`,
        'banner.jpg'
      );

      const newBanner: Banner = {
        original: url,
        sizes: {
          small: url.replace('.jpg', '_small.webp'),
          medium: url.replace('.jpg', '_medium.webp'),
          large: url.replace('.jpg', '_large.webp'),
          xlarge: url.replace('.jpg', '_xlarge.webp'),
        },
      };

      await updateDocument('events', eventId, { bannerUrls: newBanner });
      setCurrentBanner(newBanner);
    } finally {
      setUploading(false);
    }
  };

  const { small, medium, large, xlarge } = currentBanner?.sizes || {};
  const fallback = currentBanner?.original || '/default-banner.jpg';

  // ✅ Use getImageProps to generate srcSet automatically
  const common = { alt: localTitle, sizes: '100vw' };

  const {
    props: { srcSet: srcSmall },
  } = getImageProps({
    ...common,
    src: small || fallback,
    width: 480,
    height: 270, // ✅ must provide
  });

  const {
    props: { srcSet: srcMedium },
  } = getImageProps({
    ...common,
    src: medium || fallback,
    width: 768,
    height: 432, // ✅ must provide
  });

  const {
    props: { srcSet: srcLarge },
  } = getImageProps({
    ...common,
    src: large || fallback,
    width: 1080,
    height: 608, // ✅ must provide
  });

  const {
    props: { srcSet: srcXLarge, ...rest },
  } = getImageProps({
    ...common,
    src: xlarge || fallback,
    width: 1440,
    height: 810, // ✅ must provide
  });
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
        <picture>
          {xlarge && <source media='(min-width: 1440px)' srcSet={srcXLarge} />}
          {large && <source media='(min-width: 1080px)' srcSet={srcLarge} />}
          {medium && <source media='(min-width: 768px)' srcSet={srcMedium} />}
          {small && <source media='(max-width: 767px)' srcSet={srcSmall} />}
          <img {...rest} className='object-cover brightness-50 w-full h-full' />
        </picture>

        <div className='absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4'>
          <h1 className='text-4xl font-bold'>{localTitle}</h1>
          <div className='flex items-center mt-2 space-x-2 text-lg'>
            <Calendar className='w-5 h-5' />
            <span>{localDate}</span>
          </div>
        </div>
      </div>
    </>
  );

  return isAdmin ? <SectionPanel>{headerContent}</SectionPanel> : headerContent;
}
