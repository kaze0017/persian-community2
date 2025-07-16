'use client';

import React from 'react';
import ProfileImageUploader from './ProfileImageUploader';

type Props = {
  label: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  width: number;
  height: number;
};

export default function ImageUploaderWithPreview({
  label,
  file,
  setFile,
  width,
  height,
}: Props) {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  return (
    <ProfileImageUploader
      label={label}
      previewUrl={preview}
      onUpload={(f) => {
        setFile(f);
        return Promise.resolve();
      }}
      width={width}
      height={height}
    />
  );
}
