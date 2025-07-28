'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Masonry from 'react-masonry-css';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Calendar } from 'lucide-react';

type GalleryImage = {
  urls: {
    original: string;
    slide: string;
    thumbnail: string;
  };
  width: number;
  height: number;
  title?: string;
  caption?: string;
  photographer?: string;
  date?: string;
};

type Props = {
  title: string;
  description?: string;
  photographer?: string;
  date?: string;
  images: GalleryImage[];
};

export default function GalleryDisplay({
  title,
  description,
  photographer,
  date,
  images,
}: Props) {
  const [index, setIndex] = useState(-1);
  const [displayMode, setDisplayMode] = useState<'grid' | 'masonry' | 'list'>(
    'grid'
  );

  const renderImages = () => {
    switch (displayMode) {
      case 'grid':
        return (
          <div className='grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {images.map((img, i) => (
              <ImageCard key={i} img={img} index={i} onClick={setIndex} />
            ))}
          </div>
        );
      case 'masonry':
        return (
          <Masonry
            breakpointCols={{ default: 4, 1024: 3, 768: 2, 480: 1 }}
            className='flex gap-4'
            columnClassName='flex flex-col gap-4'
          >
            {images.map((img, i) => (
              <ImageCard key={i} img={img} index={i} onClick={setIndex} />
            ))}
          </Masonry>
        );
      case 'list':
        return (
          <div className='space-y-6'>
            {images.map((img, i) => (
              <div
                key={i}
                className='flex flex-col md:flex-row gap-4 items-start cursor-pointer'
                onClick={() => setIndex(i)}
              >
                <div className='relative w-full md:w-64 aspect-square rounded-xl overflow-hidden shadow'>
                  <Image
                    src={img.urls.thumbnail || img.urls.original}
                    alt={img.title ?? `image-${i}`}
                    fill
                    className='object-cover'
                  />
                </div>
                <div key={i} className='text-sm text-white space-y-1'>
                  {img.title && (
                    <div className='font-semibold'>{img.title}</div>
                  )}
                  {img.caption && <p>{img.caption}</p>}
                  {img.photographer && (
                    <p className='flex items-center gap-1'>
                      <Camera size={14} className='inline' /> {img.photographer}
                    </p>
                  )}
                  {img.date && (
                    <p className='flex items-center gap-1'>
                      <Calendar size={14} className='inline' /> {img.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header Card */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
            {/* Left Column */}
            <div className='flex-1 space-y-2'>
              <h2 className='text-2xl font-bold'>{title}</h2>
              {description && <p>{description}</p>}
              <div className='text-muted-foreground text-sm'>
                {photographer && <span>📷 {photographer}</span>}
                {date && <span className='ml-4'>📅 {date}</span>}
              </div>
            </div>

            {/* Right Column - Buttons */}
            <div className='flex gap-2 mt-4 md:mt-0'>
              <Button
                size='sm'
                variant={displayMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setDisplayMode('grid')}
              >
                Grid
              </Button>
              <Button
                size='sm'
                variant={displayMode === 'masonry' ? 'default' : 'outline'}
                onClick={() => setDisplayMode('masonry')}
              >
                Masonry
              </Button>
              <Button
                size='sm'
                variant={displayMode === 'list' ? 'default' : 'outline'}
                onClick={() => setDisplayMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Display */}
      {renderImages()}

      {/* Lightbox */}
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((img, i) => ({
          src: img.urls?.slide || img.urls?.original,
          description: (
            <div key={i} className='text-sm text-white space-y-1'>
              {img.title && <div className='font-semibold'>{img.title}</div>}
              {img.caption && <p>{img.caption}</p>}
              {img.photographer && (
                <p className='flex items-center gap-1'>
                  <Camera size={14} className='inline' /> {img.photographer}
                </p>
              )}
              {img.date && (
                <p className='flex items-center gap-1'>
                  <Calendar size={14} className='inline' /> {img.date}
                </p>
              )}
            </div>
          ),
        }))}
      />
    </div>
  );
}

function ImageCard({
  img,
  index,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  onClick: (i: number) => void;
}) {
  return (
    <div
      className='relative cursor-pointer aspect-square overflow-hidden rounded-xl shadow'
      onClick={() => onClick(index)}
    >
      <Image
        src={img.urls?.thumbnail || img.urls?.original}
        alt={img.title ?? `image-${index}`}
        fill
        className='object-cover transition-transform hover:scale-105 duration-300'
      />
    </div>
  );
}
