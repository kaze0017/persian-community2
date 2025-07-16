'use client';

import { BusinessContactConfig } from '@/types/business';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface Props {
  config: BusinessContactConfig;
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export default function ContactDisplay({ config }: Props) {
  return (
    <div className='space-y-6 mt-4'>
      {/* Row 1: Contact Details */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {config.phone && (
          <div className='flex items-center gap-3 text-muted-foreground'>
            <Phone className='w-4 h-4 text-primary' />
            <span>{config.phone}</span>
          </div>
        )}
        {config.email && (
          <div className='flex items-center gap-3 text-muted-foreground'>
            <Mail className='w-4 h-4 text-primary' />
            <span>{config.email}</span>
          </div>
        )}
        {config.address && (
          <div className='flex items-center gap-3 text-muted-foreground'>
            <MapPin className='w-4 h-4 text-primary' />
            <span>{config.address}</span>
          </div>
        )}
        {config.website && (
          <div className='flex items-center gap-3 text-muted-foreground'>
            <Globe className='w-4 h-4 text-primary' />
            <a
              href={config.website}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline truncate'
            >
              {config.website}
            </a>
          </div>
        )}
      </div>

      {/* Row 2: Social Media Icons */}
      {/* Row 2: Social Media Icons */}
      <div className='flex flex-wrap gap-4 items-center justify-center'>
        {Object.entries(config.socialLinks || {}).map(([platform, url]) => {
          if (!url) return null;
          const Icon = socialIcons[platform as keyof typeof socialIcons];
          return Icon ? (
            <a
              key={platform}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 bg-muted rounded-full hover:bg-accent transition-colors'
              aria-label={platform}
            >
              <Icon className='w-5 h-5 text-primary' />
            </a>
          ) : null;
        })}
      </div>
    </div>
  );
}
