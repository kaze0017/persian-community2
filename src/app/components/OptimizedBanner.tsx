import React from 'react';
import { Banner } from '@/types/banner';

type Props = {
  banner?: Banner;
  className?: string;
  loading?: 'lazy' | 'eager';
  alt?: string;
};

export default function OptimizedBanner({
  banner,
  className = '',
  loading = 'lazy',
  alt = 'Banner image',
}: Props) {
  const { sizes = {}, original } = banner || {};
  const { small, medium, large, xlarge } = sizes;

  const fallbackSrc = original || '/default-banner.jpg';

  return (
    <picture>
      {xlarge && (
        <source media='(min-width: 1440px)' srcSet={xlarge} sizes='100vw' />
      )}
      {large && (
        <source media='(min-width: 1024px)' srcSet={large} sizes='100vw' />
      )}
      {medium && (
        <source media='(min-width: 640px)' srcSet={medium} sizes='100vw' />
      )}
      {small && (
        <source media='(max-width: 639px)' srcSet={small} sizes='100vw' />
      )}
      <img
        src={fallbackSrc}
        alt={alt}
        className={`object-cover w-full h-full ${className}`}
        loading={loading}
        decoding='async'
      />
    </picture>
  );
}
