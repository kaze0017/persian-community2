import Image from 'next/image';
import React from 'react';
import {
  filter,
  boxShadow,
  cardClass,
} from '@/app/components/filters/logoFilter';
import Link from 'next/link';

export default function BoxButton({
  src,
  alt,
  url,
}: {
  src: string;
  alt: string;
  url: string;
}) {
  return (
    <Link href={url}>
      <div
        className={`rounded-lg overflow-hidden ${cardClass} max-h-60 max-w-60 flex justify-center items-center`}
      >
        <Image
          src={src}
          alt={alt}
          width={200}
          height={200}
          style={{ filter }}
        />
      </div>
    </Link>
  );
}
