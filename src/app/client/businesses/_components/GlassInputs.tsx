import React, { forwardRef } from 'react';
import { useEffect } from 'react';
type GlassInputProps = {
  id?: string;
  name?: string;
  label: string;
  type: string;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ id, name, label, type, placeholder, ...rest }, ref) => {
    return (
      <label className='block'>
        <span className='text-xs uppercase tracking-wide text-foreground/80'>
          {label}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...rest}
          className='mt-2 w-full rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40'
        />
      </label>
    );
  }
);

GlassInput.displayName = 'GlassInput';

import { useState } from 'react';

export function GlassImageUpload({
  label,
  defaultImage,
  wide = false,
  onChange,
  imgStyle,
}: {
  label: string;
  defaultImage: string;
  imgStyle?: string;
  wide?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [preview, setPreview] = useState<string>(defaultImage);

  // 🔑 update preview when defaultImage changes
  useEffect(() => {
    setPreview(defaultImage);
  }, [defaultImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
    onChange(e);
  };

  return (
    <div className='space-y-2 flex flex-col items-center justify-center p-2'>
      <span className='text-xs uppercase tracking-wide text-foreground/80 '>
        {label}
      </span>
      <div
        className={`relative rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-md overflow-hidden ${
          wide ? 'h-40 w-full' : 'h-32 w-32'
        }`}
      >
        <img
          src={preview || '/placeholder.png'} // 👈 fallback
          alt={label}
          className='w-full h-full object-cover'
          style={{ filter: imgStyle }}
        />
        <input
          type='file'
          accept='image/*'
          className='absolute inset-0 opacity-0 cursor-pointer'
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

type GlassTextareaProps = {
  id?: string;
  name?: string;
  label: string;
  placeholder?: string;
  rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(({ id, name, label, placeholder, rows = 4, ...rest }, ref) => {
  return (
    <label className='block'>
      <span className='text-xs uppercase tracking-wide text-foreground/80'>
        {label}
      </span>
      <textarea
        id={id}
        name={name}
        placeholder={placeholder}
        ref={ref}
        rows={rows}
        {...rest}
        className='mt-2 w-full rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 resize-none'
      />
    </label>
  );
});
