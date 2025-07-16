'use client';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import React, { RefObject } from 'react';

type ToggleConfig = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

type UploadButtonConfig = {
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type ActionButtonConfig = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

type AdminControlsPanelProps = {
  isAdmin: boolean;
  title: string;
  updating?: boolean;
  toggles?: ToggleConfig[];
  uploads?: UploadButtonConfig[];
  buttons?: ActionButtonConfig[];
};

export default function AdminControlsPanel({
  isAdmin,
  title,
  updating = false,
  toggles = [],
  uploads = [],
  buttons = [],
}: AdminControlsPanelProps) {
  if (!isAdmin) return null;

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      <h2 className='text-lg font-semibold'>{title}</h2>

      {(toggles.length > 0 || buttons.length > 0 || uploads.length > 0) && (
        <div className='flex flex-wrap items-center gap-4'>
          {/* Toggle switches */}
          {toggles.map((toggle, idx) => (
            <label key={`toggle-${idx}`} className='flex items-center gap-2'>
              <span className='text-sm'>{toggle.label}</span>
              <Switch
                checked={toggle.checked}
                onCheckedChange={toggle.onChange}
                disabled={updating}
              />
            </label>
          ))}

          {/* Action buttons */}
          {buttons.map((btn, idx) => (
            <Button
              key={`btn-${idx}`}
              variant='outline'
              size='sm'
              className='min-w-[120px]'
              onClick={btn.onClick}
              disabled={btn.disabled ?? updating}
            >
              {btn.label}
            </Button>
          ))}

          {/* Upload buttons */}
          {uploads.map((upload, idx) => (
            <div key={`upload-${idx}`} className='relative'>
              <input
                ref={upload.inputRef}
                type='file'
                accept='image/*'
                onChange={upload.onChange}
                disabled={updating}
                className='hidden'
              />
              <Button
                variant='outline'
                size='sm'
                className='min-w-[120px]'
                type='button'
                disabled={updating}
                onClick={() => {
                  const input = upload.inputRef.current;
                  if (input) {
                    input.click();
                  } else {
                    console.warn(`Upload inputRef at index ${idx} is null.`);
                  }
                }}
              >
                {upload.label}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
