'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import GalleryDisplay from './GalleryDisplay';

interface Props {
  businessId: string;
  refreshTrigger?: number;
}

interface GalleryImage {
  url: string;
  title?: string;
  caption?: string;
  photographer?: string;
  date?: string;
}

interface GalleryData {
  title?: string;
  description?: string;
  photographer?: string;
  date?: string;
  images: GalleryImage[];
}

export default function GalleryDisplayWithFetch({
  businessId,
  refreshTrigger,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryData | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      setError(null);

      try {
        const docRef = doc(db, 'businesses', businessId, 'gallery', businessId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          setGallery(null);
        } else {
          const data = snapshot.data();
          if (!data.images || !Array.isArray(data.images)) {
            setGallery(null);
          } else {
            setGallery({
              title: data.title,
              description: data.description,
              photographer: data.photographer,
              date: data.date,
              images: data.images,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [businessId, refreshTrigger]);

  if (loading) return <p>Loading gallery...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;
  if (!gallery || gallery.images.length === 0)
    return <p className='text-gray-500'>No gallery uploaded yet.</p>;

  return (
    <GalleryDisplay
      title={gallery.title || 'Gallery'}
      description={gallery.description}
      photographer={gallery.photographer}
      date={gallery.date}
      images={gallery.images.map((img) => ({
        src: img.url,
        width: 1,
        height: 1,
        title: img.title,
        caption: img.caption,
        photographer: img.photographer,
        date: img.date,
      }))}
    />
  );
}
