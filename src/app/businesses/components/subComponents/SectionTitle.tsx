import React from 'react';

export default function SectionTitle({
  title = 'Section Title',
}: {
  title?: string;
}) {
  return (
    <div>
      {title && <h2 className='text-2xl font-semibold mb-4'>{title}</h2>}
    </div>
  );
}
