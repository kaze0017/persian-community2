'use client';

import { BusinessContactConfig } from '@/types/business';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  form: BusinessContactConfig;
  updating: boolean;
  onChange: (form: BusinessContactConfig) => void;
  onFieldChange: (field: keyof BusinessContactConfig, value: string) => void;
  onSocialLinkChange: (
    field: keyof NonNullable<BusinessContactConfig['socialLinks']>,
    value: string
  ) => void;
  onCancel: () => void;
  onSave: () => void;
}

// Define as const tuple for better type inference
const socialPlatforms = [
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
] as const;

export default function ContactForm({
  form,
  onFieldChange,
  onSocialLinkChange,
  onCancel,
  onSave,
  updating,
}: Props) {
  return (
    <div className='space-y-4'>
      <Input
        placeholder='Phone'
        value={form.phone || ''}
        onChange={(e) => onFieldChange('phone', e.target.value)}
        disabled={updating}
      />
      <Input
        placeholder='Email'
        value={form.email || ''}
        onChange={(e) => onFieldChange('email', e.target.value)}
        disabled={updating}
      />
      <Input
        placeholder='Address'
        value={form.address || ''}
        onChange={(e) => onFieldChange('address', e.target.value)}
        disabled={updating}
      />
      <Input
        placeholder='Website'
        value={form.website || ''}
        onChange={(e) => onFieldChange('website', e.target.value)}
        disabled={updating}
      />

      <div className='grid grid-cols-2 gap-4'>
        {socialPlatforms.map((platform) => (
          <Input
            key={platform}
            placeholder={`${
              platform.charAt(0).toUpperCase() + platform.slice(1)
            } URL`}
            value={form.socialLinks?.[platform] || ''}
            onChange={(e) =>
              onSocialLinkChange(
                platform as keyof NonNullable<
                  BusinessContactConfig['socialLinks']
                >,
                e.target.value
              )
            }
            disabled={updating}
          />
        ))}
      </div>

      <div className='flex justify-end gap-2'>
        <Button variant='ghost' onClick={onCancel} disabled={updating}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={updating}>
          Save
        </Button>
      </div>
    </div>
  );
}
